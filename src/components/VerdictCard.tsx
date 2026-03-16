'use client';

import { useState, useCallback } from 'react';
import type { AnalysisResult } from '@/types';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { useLanguage } from '@/hooks/useLanguage';
import { TRANSLATIONS } from '@/config/i18n';
import { useToast } from '@/components/Toast';
import { copyTextToClipboard } from '@/utils/clipboard';
import { generateMarkdownReport, downloadMarkdown } from '@/utils/exportMarkdown';

interface VerdictCardProps {
  result: AnalysisResult;
  aiInsights: string | null;
}

export function VerdictCard({ result, aiInsights }: VerdictCardProps) {
  const { language, t } = useLanguage();
  const { showToast } = useToast();
  const [copiedSummary, setCopiedSummary] = useState(false);

  const handleCopySummary = useCallback(async () => {
    const action = result.security.detections.length > 0
      ? t(TRANSLATIONS.summary.actionRisky)
      : t(TRANSLATIONS.summary.actionQuality);
    const summary = [
      `${t(TRANSLATIONS.verdict.riskLabel)}: ${result.security.riskScore}/5`,
      `${t(TRANSLATIONS.verdict.qualityLabel)}: ${result.quality.qualityScore}/5`,
      `${t(TRANSLATIONS.summary.detections)}: ${result.security.detections.length}`,
      `${t(TRANSLATIONS.summary.suggestions)}: ${result.quality.suggestions.length}`,
      `${action}`,
    ].join('\n');
    await copyTextToClipboard(summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 1500);
    showToast(t(TRANSLATIONS.security.copied));
  }, [result, showToast, t]);

  const handleExport = useCallback(() => {
    const lang = language === 'fr' ? 'fr' as const : 'en' as const;
    const md = generateMarkdownReport(result, aiInsights, lang);
    const filename = `${t(TRANSLATIONS.export.filename)}-${new Date().toISOString().slice(0, 10)}.md`;
    downloadMarkdown(md, filename);
  }, [result, aiInsights, language, t]);

  return (
    <div id="verdict" className="bg-[#111] rounded-2xl border border-white/10 border-t-2 border-t-blue-500/40 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-white">
            {t(TRANSLATIONS.summary.title)}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {new Date(result.timestamp).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopySummary}
            className={`
              inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition-all duration-300 active:scale-95
              ${copiedSummary
                ? 'text-emerald-300 border border-emerald-500/40 bg-emerald-500/15 scale-105'
                : 'text-slate-300 border border-white/10 bg-white/[0.03] hover:bg-white/[0.08]'
              }
            `}
          >
            {copiedSummary && (
              <svg className="w-3.5 h-3.5 animate-fade-in" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {copiedSummary ? t(TRANSLATIONS.security.copied) : t(TRANSLATIONS.summary.copyButton)}
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="px-2.5 py-1 text-xs text-slate-300 border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] rounded-md transition-all active:scale-95"
          >
            {t(TRANSLATIONS.export.button)}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">{t(TRANSLATIONS.verdict.riskLabel)}</span>
          <ScoreBadge score={result.security.riskScore} type="risk" size="sm" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">{t(TRANSLATIONS.verdict.qualityLabel)}</span>
          <ScoreBadge score={result.quality.qualityScore} type="quality" size="sm" />
        </div>
        <div className="text-xs text-slate-400">
          {result.security.detections.length} {t(TRANSLATIONS.summary.detections)}
        </div>
        <div className="text-xs text-slate-400">
          {result.quality.suggestions.length} {t(TRANSLATIONS.summary.suggestions)}
        </div>
      </div>

      <div className="text-sm text-slate-200 rounded-xl border border-white/10 bg-black/20 p-3">
        {result.security.detections.length > 0
          ? t(TRANSLATIONS.summary.actionRisky)
          : t(TRANSLATIONS.summary.actionQuality)}
      </div>
    </div>
  );
}
