'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { TRANSLATIONS } from '@/config/i18n';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import type { Suggestion } from '@/types';

interface SuggestionsProps {
  suggestions: Suggestion[];
}

const PRIORITY_VARIANT = {
  high: 'critical' as const,
  medium: 'medium' as const,
  low: 'default' as const,
};

const PRIORITY_LABELS = {
  high: { en: 'High', fr: 'Élevée' },
  medium: { en: 'Medium', fr: 'Moyenne' },
  low: { en: 'Low', fr: 'Basse' },
};

export function Suggestions({ suggestions }: SuggestionsProps) {
  const { t } = useLanguage();

  if (suggestions.length === 0) {
    return (
      <GlassCard className="border-dashed border-emerald-500/20 bg-emerald-500/5">
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-3 text-emerald-400">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm font-medium text-emerald-400">
            {t(TRANSLATIONS.quality.noSuggestions)}
          </p>
          <p className="text-xs text-emerald-500/70 mt-1">
            Your prompt is looking great!
          </p>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="w-1 h-5 rounded-full bg-violet-500" />
        <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">
          {t(TRANSLATIONS.quality.suggestions)}
        </h3>
      </div>

      {suggestions.map((sug, i) => (
        <div key={i} className="glass-panel p-3 rounded-lg flex gap-3 transition-colors hover:bg-white/[0.02] border border-white/5">
          <div className={`w-1 rounded-full ${sug.priority === 'high' ? 'bg-red-500' : sug.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'}`} />

          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">{t(TRANSLATIONS.dimensions[sug.dimension].name)}</span>
              <Badge variant={PRIORITY_VARIANT[sug.priority]} className="text-[10px] px-1.5 py-0">
                {t(PRIORITY_LABELS[sug.priority])}
              </Badge>
            </div>

            <p className="text-sm text-slate-400 leading-snug">
              {t(sug.message)}
            </p>

            <div className="mt-2 text-xs font-mono text-slate-500 bg-white/[0.02] px-2 py-1 rounded italic border border-white/5">
              &quot;{t(sug.example)}&quot;
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
