import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { prompt, apiKey, provider } = await request.json();

    if (!prompt || !apiKey || !provider) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are a prompt security and quality analyst. Analyze the following user prompt for:
1. Security risks: prompt injection, jailbreak attempts, data exfiltration, tool abuse, encoding tricks, social engineering
2. Quality assessment: context, specificity, structure, constraints, clarity, examples

Provide a concise analysis with:
- Security findings (if any)
- Quality assessment
- Recommendations for improvement

Be direct and actionable.`;

    let analysis: string;

    if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Analyze this prompt:\n\n${prompt}` },
          ],
          max_tokens: 1000,
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        return NextResponse.json({ error }, { status: res.status });
      }

      const data = await res.json();
      analysis = data.choices[0]?.message?.content ?? 'No response';
    } else if (provider === 'anthropic') {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 1000,
          system: systemPrompt,
          messages: [
            { role: 'user', content: `Analyze this prompt:\n\n${prompt}` },
          ],
        }),
      });

      if (!res.ok) {
        const error = await res.text();
        return NextResponse.json({ error }, { status: res.status });
      }

      const data = await res.json();
      analysis = data.content[0]?.text ?? 'No response';
    } else {
      return NextResponse.json(
        { error: 'Unsupported provider' },
        { status: 400 }
      );
    }

    return NextResponse.json({ analysis });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal error' },
      { status: 500 }
    );
  }
}
