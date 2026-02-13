'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { TRANSLATIONS } from '@/config/i18n';

interface RiskGaugeProps {
  score: 1 | 2 | 3 | 4 | 5;
}

const RISK_COLORS = {
  1: '#10B981', // Emerald
  2: '#84CC16', // Lime
  3: '#F59E0B', // Amber
  4: '#F97316', // Orange
  5: '#EF4444', // Red
};

export function RiskGauge({ score }: RiskGaugeProps) {
  const { t } = useLanguage();
  const color = RISK_COLORS[score];
  const label = t(TRANSLATIONS.security.riskLabels[score]);

  return (
    <div className="glass-panel p-4 rounded-xl flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-1">
          {t(TRANSLATIONS.security.riskScore)}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-white tracking-tight">{score}/5</span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full border border-white/5 bg-white/5" style={{ color: color, borderColor: `${color}20` }}>
            {label}
          </span>
        </div>
      </div>

      {/* Mini Progress Bars matching Bento density */}
      <div className="flex gap-0.5 items-end h-8">
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`w-1.5 rounded-sm transition-all duration-300 ${s <= score ? '' : 'opacity-20 bg-slate-700'}`}
            style={{
              height: `${20 + (s * 4)}%`,
              backgroundColor: s <= score ? color : undefined
            }}
          />
        ))}
      </div>
    </div>
  );
}
