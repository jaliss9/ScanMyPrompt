'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { TRANSLATIONS } from '@/config/i18n';

interface QualityGaugeProps {
  score: 1 | 2 | 3 | 4 | 5;
}

const QUALITY_COLORS = {
  1: '#EF4444',
  2: '#F97316',
  3: '#F59E0B',
  4: '#84CC16',
  5: '#10B981',
};

export function QualityGauge({ score }: QualityGaugeProps) {
  const { t } = useLanguage();
  const color = QUALITY_COLORS[score];
  const label = t(TRANSLATIONS.quality.qualityLabels[score]);

  return (
    <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">
          {t(TRANSLATIONS.quality.qualityScore)}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white tracking-tight">{score}/5</span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full border border-white/5 bg-white/5" style={{ color: color, borderColor: `${color}20` }}>
            {label}
          </span>
        </div>
      </div>

      {/* Circle Indicators */}
      <div className="flex gap-1 items-center">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${s <= score ? '' : 'opacity-20 bg-slate-700'}`}
            style={{
              backgroundColor: s <= score ? color : undefined,
              boxShadow: s <= score ? `0 0 8px ${color}40` : 'none'
            }}
          />
        ))}
      </div>
    </div>
  );
}
