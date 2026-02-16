import { NextResponse } from 'next/server';
import { sanitizeAiInsightsText } from '@/utils/aiInsights';

// ---------------------------------------------------------------------------
// Simple in-memory rate limiter (per-IP, sliding window)
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 10; // max requests per window

const ipHits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (hits.length >= RATE_LIMIT_MAX) {
    ipHits.set(ip, hits);
    return true;
  }
  hits.push(now);
  ipHits.set(ip, hits);
  return false;
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

export async function POST(request: Request) {
  try {
    // --- Rate limiting ---
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded?.split(',')[0]?.trim() ?? 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 },
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ insights: null });
    }

    const body = await request.json();
    const { language, riskScore, qualityScore } = body;
    let { prompt } = body;

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ insights: null });
    }

    // --- Input size limit ---
    prompt = prompt.slice(0, MAX_PROMPT_LENGTH);

    if (!prompt) {
      return NextResponse.json({ insights: null });
    }

    const isFrench = language === 'fr';
    const lang = isFrench ? 'French' : 'English';

    const systemPrompt = `You are a prompt security and quality expert. Analyze the following user prompt and provide a concise, actionable analysis in strict markdown.

Respond entirely in ${lang}.

The heuristic engine has already detected:
- Security risk score: ${riskScore}/5
- Quality score: ${qualityScore}/5

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
    });

    if (!res.ok) {
      console.error('Groq API error:', res.status, await res.text());
      return NextResponse.json({ insights: null });
    }

    const data = await res.json();
    const rawInsights = data.choices?.[0]?.message?.content ?? null;
    const insights = rawInsights ? sanitizeAiInsightsText(rawInsights, 6000) : null;

    return NextResponse.json({ insights });
  } catch (error) {
    console.error('AI insights error:', error);
    return NextResponse.json({ insights: null });
  }
}
