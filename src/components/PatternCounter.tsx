'use client';

import { ANALYSIS_METRICS } from '@/engine/metrics';
import { useLanguage } from '@/hooks/useLanguage';
import { TRANSLATIONS } from '@/config/i18n';

interface PatternCounterProps {
    issuesFound: number;
}

export function PatternCounter({ issuesFound }: PatternCounterProps) {
    const { t } = useLanguage();

    const issueLabel =
        issuesFound === 0
            ? t(TRANSLATIONS.patternCounter.noIssues)
            : issuesFound === 1
                ? t(TRANSLATIONS.patternCounter.issueFound)
                : t(TRANSLATIONS.patternCounter.issuesFound);

    return (
        <div className="bg-[#111111] border border-[#222] rounded-xl p-4 mb-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-md shadow-blue-600/20">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-semibold text-white text-sm">
                            {ANALYSIS_METRICS.securityPatterns} {t(TRANSLATIONS.patternCounter.patternsVerified)}
                        </p>
                        <p className="text-xs text-slate-400">
                            {ANALYSIS_METRICS.securityCategories} {t(TRANSLATIONS.patternCounter.owaspAnalyzed)}
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className={`text-2xl font-bold ${issuesFound > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                        {issuesFound}
                    </p>
                    <p className="text-xs text-slate-400">
                        {issueLabel}
                    </p>
                </div>
            </div>
        </div>
    );
}
