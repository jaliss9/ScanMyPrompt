import type { AnalysisResult, Language } from '@/types';
import { TRANSLATIONS } from '@/config/i18n';

type Bilingual = { en: string; fr: string };

function t(obj: Bilingual, lang: Language): string {
  return obj[lang];
}

/**
 * Generate a Markdown report from an analysis result.
 * 100% client-side, no external dependencies.
 */
export function generateMarkdownReport(
  result: AnalysisResult,
  aiInsights: string | null,
  language: Language,
): string {
  const lines: string[] = [];
  const date = new Date(result.timestamp).toLocaleString(language === 'fr' ? 'fr-FR' : 'en-US');

  // --- Header ---
  lines.push(`# ScanMyPrompt Report — ${date}`);
  lines.push('');

  // --- Analyzed Prompt ---
  const promptLabel = language === 'fr' ? 'Prompt analysé' : 'Analyzed Prompt';
  lines.push(`## ${promptLabel}`);
  lines.push('');
  lines.push('```');
  lines.push(result.prompt);
  lines.push('```');
  lines.push('');

  // --- Security ---
  const riskLabel = t(result.security.riskLabel, language);
  const secTitle = t(TRANSLATIONS.security.title, language);
  lines.push(`## ${secTitle} — ${result.security.riskScore}/5 (${riskLabel})`);
  lines.push('');

  // Detections
  const detections = result.security.detections;
  if (detections.length > 0) {
    const detTitle = t(TRANSLATIONS.security.detections, language);
    lines.push(`### ${detTitle} (${detections.length})`);
    lines.push('');
    for (const det of detections) {
      const name = t(det.name, language);
      const desc = t(det.description, language);
      const severity = Math.round(det.severity * 100);
      const sevLabel = t(TRANSLATIONS.security.severity, language);
      lines.push(`- **${name}** — ${desc} (${sevLabel}: ${severity}%)`);
      lines.push(`  > \`${det.matchedText}\``);
    }
    lines.push('');
  } else {
    lines.push(t(TRANSLATIONS.security.noDetections, language));
    lines.push('');
  }

  // Category Breakdown
  const catHeader = t(TRANSLATIONS.categoryBreakdown.category, language);
  const scoreHeader = t(TRANSLATIONS.categoryBreakdown.riskScore, language);
  const detHeader = t(TRANSLATIONS.categoryBreakdown.detections, language);
  lines.push(`| ${catHeader} | ${scoreHeader} | ${detHeader} |`);
  lines.push('| --- | --- | --- |');
  for (const cat of result.security.categories) {
    const catName = t(TRANSLATIONS.categories[cat.category].name, language);
    const pct = Math.round(cat.score * 100);
    lines.push(`| ${catName} | ${pct}% | ${cat.detections.length} |`);
  }
  lines.push('');

  // Safe Rewrite
  if (result.security.safeVersion && result.security.safeVersion !== result.prompt) {
    const safeTitle = t(TRANSLATIONS.security.safeRewrite, language);
    lines.push(`### ${safeTitle}`);
    lines.push('');
    lines.push('```');
    lines.push(result.security.safeVersion);
    lines.push('```');
    lines.push('');
  }

  // --- Quality ---
  const qualLabel = t(result.quality.qualityLabel, language);
  const qualTitle = t(TRANSLATIONS.quality.title, language);
  lines.push(`## ${qualTitle} — ${result.quality.qualityScore}/5 (${qualLabel})`);
  lines.push('');

  // Dimension Scores
  const dimLabel = t(TRANSLATIONS.quality.dimensions, language);
  lines.push(`### ${dimLabel}`);
  lines.push('');
  const dimNameHeader = language === 'fr' ? 'Dimension' : 'Dimension';
  const dimScoreHeader = 'Score';
  lines.push(`| ${dimNameHeader} | ${dimScoreHeader} |`);
  lines.push('| --- | --- |');
  for (const dim of result.quality.dimensions) {
    const name = t(TRANSLATIONS.dimensions[dim.dimension].name, language);
    const stars = '★'.repeat(Math.round(dim.score * 5)) + '☆'.repeat(5 - Math.round(dim.score * 5));
    lines.push(`| ${name} | ${stars} ${Math.round(dim.score * 100)}% |`);
  }
  lines.push('');

  // Suggestions
  if (result.quality.suggestions.length > 0) {
    const sugTitle = t(TRANSLATIONS.quality.suggestions, language);
    lines.push(`### ${sugTitle}`);
    lines.push('');
    for (const sug of result.quality.suggestions) {
      const dimName = t(TRANSLATIONS.dimensions[sug.dimension].name, language);
      const msg = t(sug.message, language);
      const ex = t(sug.example, language);
      const priority = sug.priority.toUpperCase();
      lines.push(`- **[${priority}]** ${dimName} — ${msg}`);
      lines.push(`  > ${language === 'fr' ? 'Exemple' : 'Example'}: "${ex}"`);
    }
    lines.push('');
  }

  // Improved Version
  if (result.quality.improvedVersion && result.quality.improvedVersion !== result.prompt) {
    const impTitle = t(TRANSLATIONS.quality.improvedPrompt, language);
    lines.push(`### ${impTitle}`);
    lines.push('');
    lines.push('```');
    lines.push(result.quality.improvedVersion);
    lines.push('```');
    lines.push('');
  }

  // --- AI Insights ---
  if (aiInsights) {
    const aiTitle = t(TRANSLATIONS.ai.title, language);
    lines.push(`## ${aiTitle}`);
    lines.push('');
    lines.push(aiInsights);
    lines.push('');
  }

  // --- Footer ---
  lines.push('---');
  lines.push(`*Generated by [ScanMyPrompt](https://scan-my-prompt.vercel.app)*`);

  return lines.join('\n');
}

/**
 * Trigger a browser download of a Markdown file.
 */
export function downloadMarkdown(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
