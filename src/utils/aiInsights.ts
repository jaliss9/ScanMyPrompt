export function sanitizeAiInsightsText(text: string, maxLength?: number): string {
  const sanitized = text
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<\/?[^>]+(>|$)/g, '')
    // Keep \n, \r and \t to preserve markdown structure/readability.
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .trim();

  if (typeof maxLength === 'number') {
    return sanitized.slice(0, maxLength);
  }

  return sanitized;
}

export function extractImprovedPromptFromInsights(insights: string): string | null {
  const lines = insights.split('\n');
  const headingPattern = /^\s*(#{2,4}\s*)?(version améliorée du prompt|improved prompt version)\s*$/i;
  const nextHeadingPattern = /^\s*#{2,4}\s+\S+/;

  const startIndex = lines.findIndex((line) => headingPattern.test(line.trim()));
  if (startIndex === -1) return null;

  const collected: string[] = [];
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (nextHeadingPattern.test(line.trim())) break;
    collected.push(line);
  }

  const extracted = collected.join('\n').trim();
  return extracted.length > 0 ? extracted : null;
}

