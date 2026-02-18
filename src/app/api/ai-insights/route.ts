import { NextResponse } from 'next/server';
import { sanitizeAiInsightsText } from '@/utils/aiInsights';

// ---------------------------------------------------------------------------
// Simple in-memory rate limiter (per-IP, sliding window)
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10; // max requests per window

const ipHits = new Map<string, number[]>();

function getClientIp(request: Request): string {
  const candidates = [
    request.headers.get('x-vercel-forwarded-for'),
    request.headers.get('x-forwarded-for'),
    request.headers.get('x-real-ip'),
    request.headers.get('cf-connecting-ip'),
  ];

  for (const value of candidates) {
    if (!value) continue;
    const ip = value.split(',')[0]?.trim();
    if (ip && /^[0-9a-fA-F:.]+$/.test(ip)) return ip;
  }

  return 'unknown';
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (!origin || !host) return true;

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function isRateLimited(ip: string): { limited: boolean; retryAfter: number } {
  const now = Date.now();
  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  const oldestHit = hits[0] ?? now;
  const retryAfter = Math.max(1, Math.ceil((RATE_LIMIT_WINDOW_MS - (now - oldestHit)) / 1000));

  if (hits.length >= RATE_LIMIT_MAX) {
    ipHits.set(ip, hits);
    return { limited: true, retryAfter };
  }

  hits.push(now);
  ipHits.set(ip, hits);
  return { limited: false, retryAfter: 0 };
}

// Periodically prune stale entries to avoid unbounded memory growth
setInterval(() => {
  const now = Date.now();
  for (const [ip, hits] of ipHits) {
    const fresh = hits.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (fresh.length === 0) ipHits.delete(ip);
    else ipHits.set(ip, fresh);
  }
}, RATE_LIMIT_WINDOW_MS * 2);

// ---------------------------------------------------------------------------
const MAX_PROMPT_LENGTH = 8_000; // characters
const GROQ_TIMEOUT_MS = 15_000; // 15 seconds — abort if Groq hangs
const JSON_HEADERS = {
  'Cache-Control': 'no-store, max-age=0',
};

export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) {
      return NextResponse.json({ error: 'Forbidden origin' }, { status: 403, headers: JSON_HEADERS });
    }

    // --- Rate limiting ---
    const ip = getClientIp(request);
    const { limited, retryAfter } = isRateLimited(ip);
    if (limited) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            ...JSON_HEADERS,
            'Retry-After': String(retryAfter),
          },
        },
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ insights: null }, { headers: JSON_HEADERS });
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ insights: null }, { headers: JSON_HEADERS });
    }

    const { language, riskScore, qualityScore } = body;
    let { prompt } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ insights: null }, { headers: JSON_HEADERS });
    }

    // --- Input size limit ---
    prompt = prompt.slice(0, MAX_PROMPT_LENGTH);

    if (!prompt) {
      return NextResponse.json({ insights: null }, { headers: JSON_HEADERS });
    }

    const isFrench = language === 'fr';
    const lang = isFrench ? 'French' : 'English';
    const safeRiskScore = Number.isFinite(Number(riskScore))
      ? Math.max(0, Math.min(5, Math.round(Number(riskScore))))
      : 0;
    const safeQualityScore = Number.isFinite(Number(qualityScore))
      ? Math.max(0, Math.min(5, Math.round(Number(qualityScore))))
      : 0;

    const systemPrompt = `You are a prompt security and quality expert. Analyze the following user prompt and provide a concise, actionable analysis in strict markdown.

Respond entirely in ${lang}.

The heuristic engine has already detected:
- Security risk score: ${safeRiskScore}/5
- Quality score: ${safeQualityScore}/5

Your analysis should add value beyond the heuristic results. Provide:
1. A brief security assessment (2-3 sentences) — explain WHY the prompt might be risky or safe
2. Concrete quality improvements (2-3 bullet points) — specific, actionable suggestions
3. An improved version of the prompt (rewrite it to be both safer and higher quality)

Keep your response under 300 words.
Do NOT repeat the scores — focus on insights the heuristic engine cannot provide.
Do NOT output any HTML tags.

Use exactly this structure:
### ${isFrench ? 'Évaluation de sécurité' : 'Security assessment'}
[2-3 short sentences]

### ${isFrench ? 'Améliorations de qualité' : 'Quality improvements'}
- [improvement 1]
- [improvement 2]
- [improvement 3 optional]

### ${isFrench ? 'Version améliorée du prompt' : 'Improved prompt version'}
\`\`\`
[rewritten prompt only]
\`\`\``;

    // --- Fetch with timeout to prevent infinite hangs ---
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), GROQ_TIMEOUT_MS);

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Analyze this prompt:\n\n${prompt}` },
          ],
          max_tokens: 800,
          temperature: 0.3,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        console.error('Groq API error:', res.status, await res.text());
        return NextResponse.json({ insights: null }, { headers: JSON_HEADERS });
      }

      const data = await res.json();
      const rawInsights = data.choices?.[0]?.message?.content ?? null;
      const insights = rawInsights ? sanitizeAiInsightsText(rawInsights, 6000) : null;

      return NextResponse.json({ insights }, { headers: JSON_HEADERS });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
        console.error('Groq API timeout after', GROQ_TIMEOUT_MS, 'ms');
      } else {
        console.error('Groq API fetch error:', fetchError);
      }
      return NextResponse.json({ insights: null }, { headers: JSON_HEADERS });
    }
  } catch (error) {
    console.error('AI insights error:', error);
    return NextResponse.json({ insights: null }, { headers: JSON_HEADERS });
  }
}
