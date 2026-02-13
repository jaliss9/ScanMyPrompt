import type { DimensionScore } from '@/types';

export function generateImprovedVersion(
  prompt: string,
  dimensions: DimensionScore[]
): string {
  let improved = prompt;
  const additions: string[] = [];

  const dimMap = new Map(dimensions.map((d) => [d.dimension, d]));

  // 1. If no context: prepend a generic role based on detected topic
  const contextScore = dimMap.get('context')?.score ?? 0;
  if (contextScore < 0.5) {
    const role = detectTopicRole(prompt);
    additions.push(`[Added context] ${role}`);
    improved = `${role}\n\n${improved}`;
  }

  // 2. If no clear action verb: prepend one
  const clarityScore = dimMap.get('clarity')?.score ?? 0;
  if (clarityScore < 0.3 && !startsWithActionVerb(prompt)) {
    const verb = detectIntentVerb(prompt);
    improved = `${verb} ${improved.charAt(0).toLowerCase()}${improved.slice(1)}`;
  }

  // 3. If vague words: try to flag them
  const specificityScore = dimMap.get('specificity')?.score ?? 0;
  if (specificityScore < 0.4) {
    improved = flagVagueWords(improved);
  }

  // 4. If no structure and prompt is long: add section markers
  const structureScore = dimMap.get('structure')?.score ?? 0;
  if (structureScore < 0.3 && prompt.length > 200) {
    // Don't restructure — just note it
  }

  // 5. If no constraints: append format guidance
  const constraintScore = dimMap.get('constraints')?.score ?? 0;
  if (constraintScore < 0.4) {
    const constraint = '\n\nPlease provide your response in a structured format with clear sections.';
    improved = improved + constraint;
  }

  return improved;
}

function detectTopicRole(prompt: string): string {
  const lower = prompt.toLowerCase();

  if (/\b(code|programming|function|bug|debug|software|app|api|database|sql)\b/.test(lower)) {
    return 'You are a senior software engineer.';
  }
  if (/\b(market|sales|brand|customer|campaign|seo|content|social media)\b/.test(lower)) {
    return 'You are a marketing strategist.';
  }
  if (/\b(data|analysis|chart|graph|statistics|metrics|trend|dataset)\b/.test(lower)) {
    return 'You are a data analyst.';
  }
  if (/\b(write|essay|article|blog|story|poem|creative|draft)\b/.test(lower)) {
    return 'You are a professional writer.';
  }
  if (/\b(legal|law|contract|compliance|regulation|policy)\b/.test(lower)) {
    return 'You are a legal advisor.';
  }
  if (/\b(health|medical|diagnosis|patient|treatment|symptom)\b/.test(lower)) {
    return 'You are a health information specialist.';
  }
  if (/\b(teach|learn|education|student|course|lesson|curriculum)\b/.test(lower)) {
    return 'You are an experienced educator.';
  }
  if (/\b(finance|invest|budget|accounting|tax|revenue|profit)\b/.test(lower)) {
    return 'You are a financial analyst.';
  }

  return 'You are a knowledgeable assistant.';
}

function startsWithActionVerb(prompt: string): boolean {
  const actionVerbs = ['list', 'explain', 'compare', 'analyze', 'summarize', 'create', 'write', 'generate', 'describe', 'evaluate', 'classify', 'translate', 'design', 'calculate', 'recommend', 'outline', 'review', 'identify', 'suggest', 'define', 'implement', 'develop', 'build', 'convert', 'extract', 'organize'];
  const firstWord = prompt.trim().split(/\s+/)[0]?.toLowerCase() || '';
  return actionVerbs.includes(firstWord);
}

function detectIntentVerb(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (/\b(difference|compare|vs|versus|better)\b/.test(lower)) return 'Compare';
  if (/\b(how|explain|why|understand)\b/.test(lower)) return 'Explain';
  if (/\b(list|enumerate|name)\b/.test(lower)) return 'List';
  if (/\b(write|draft|compose)\b/.test(lower)) return 'Write';
  if (/\b(create|make|build|generate)\b/.test(lower)) return 'Generate';
  if (/\b(summarize|summary|brief|overview)\b/.test(lower)) return 'Summarize';
  if (/\b(review|evaluate|assess|critique)\b/.test(lower)) return 'Evaluate';
  return 'Please';
}

function flagVagueWords(prompt: string): string {
  const vagueReplacements: [RegExp, string][] = [
    [/\bsomething\b/gi, '[specify what]'],
    [/\bstuff\b/gi, '[specify items]'],
    [/\bthings\b/gi, '[specify items]'],
    [/\bkind of\b/gi, ''],
    [/\bsort of\b/gi, ''],
  ];

  let result = prompt;
  let modified = false;
  for (const [regex, replacement] of vagueReplacements) {
    if (regex.test(result)) {
      modified = true;
      result = result.replace(regex, replacement);
    }
  }

  if (modified) {
    result = result.replace(/\s{2,}/g, ' ').trim();
  }

  return result;
}
