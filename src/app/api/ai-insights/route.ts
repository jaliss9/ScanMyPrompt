import { NextResponse } from 'next/server';

function sanitizeModelText(text: string): string {
  return text
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<\/?[^>]+(>|$)/g, '')
    // Keep \n, \r and \t to preserve markdown structure/readability.
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim()
    .slice(0, 6000);
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ insights: null });
    }

    const { prompt, language, riskScore, qualityScore } = await request.json();

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
    const insights = rawInsights ? sanitizeModelText(rawInsights) : null;

    return NextResponse.json({ insights });
  } catch (error) {
    console.error('AI insights error:', error);
    return NextResponse.json({ insights: null });
  }
}
