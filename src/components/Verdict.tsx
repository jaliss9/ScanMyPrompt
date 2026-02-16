'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { TRANSLATIONS } from '@/config/i18n';
import { useToast } from '@/components/Toast';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import type { AnalysisResult } from '@/types';

interface VerdictProps {
  result: AnalysisResult;
  showDetails: boolean;
  onToggleDetails: () => void;
}

export function Verdict({ result, showDetails, onToggleDetails }: VerdictProps) {
  const { t } = useLanguage();
  const { showToast } = useToast();

  const isRisky = result.security.riskScore >= 3;
  const verdictMessage = isRisky
    ? t(TRANSLATIONS.verdict.risky)
    : t(TRANSLATIONS.verdict.safe);

  const qualityPercent = Math.round((result.quality.qualityScore / 5) * 100);
  const hasImprovedVersion = result.quality.improvedVersion !== result.prompt;

  const handleCopyImproved = () => {
    navigator.clipboard.writeText(result.quality.improvedVersion);
    showToast(t(TRANSLATIONS.security.copied));
  };

  return (
    <div id="verdict" className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden animate-fade-in">
      {/* Top bar with colored accent */}
      <div className={`h-1.5 ${isRisky ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-emerald-500 to-blue-500'}`} />

      <div className="p-6 sm:p-8">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isRisky ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
              {isRisky ? (
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">{t(TRANSLATIONS.verdict.analysisComplete)}</h3>
              <p className="text-xs text-gray-500">{new Date(result.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>

          {hasImprovedVersion && (
            <button
              type="button"
              onClick={handleCopyImproved}
              className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/25 text-xs font-medium text-cyan-300 hover:bg-cyan-500/20 transition-colors"
            >
              {t(TRANSLATIONS.quality.copyImproved)}
            </button>
          )}
        </div>

        {/* Score badges */}
        <div className="flex gap-6 mb-6">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-900/50 rounded-xl border border-gray-700">
            <span className="text-xs font-medium text-gray-400">{t(TRANSLATIONS.verdict.riskLabel)}</span>
            <ScoreBadge score={result.security.riskScore} type="risk" />
            <span className="text-xs text-gray-500">/ 5</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-900/50 rounded-xl border border-gray-700">
            <span className="text-xs font-medium text-gray-400">{t(TRANSLATIONS.verdict.qualityLabel)}</span>
            <ScoreBadge score={result.quality.qualityScore} type="quality" />
            <span className="text-xs text-gray-500">({qualityPercent}%)</span>
          </div>
        </div>

        {/* Verdict sentence */}
        <p className="text-sm text-gray-300 leading-relaxed mb-6">
          {verdictMessage}
        </p>

        {/* Toggle details button */}
        <button
          onClick={onToggleDetails}
          className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          <span>{showDetails ? t(TRANSLATIONS.verdict.hideDetails) : t(TRANSLATIONS.verdict.seeDetails)}</span>
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${showDetails ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
