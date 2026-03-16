'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { TRANSLATIONS } from '@/config/i18n';
import { IconBadge } from '@/components/ui/IconBadge';
import { ZapIcon, CheckCircleIcon, SparklesIcon } from '@/components/ui/Icons';

const CARDS = [
  { icon: <ZapIcon />, variant: 'primary' as const, titleKey: TRANSLATIONS.features.instantTitle, descKey: TRANSLATIONS.features.instantDesc, gradient: 'from-blue-500/5' },
  { icon: <CheckCircleIcon />, variant: 'success' as const, titleKey: TRANSLATIONS.features.owaspTitle, descKey: TRANSLATIONS.features.owaspDesc, gradient: 'from-emerald-500/5' },
  { icon: <SparklesIcon />, variant: 'primary' as const, titleKey: TRANSLATIONS.features.autoTitle, descKey: TRANSLATIONS.features.autoDesc, gradient: 'from-purple-500/5' },
] as const;

export function FeaturesGrid({ showScoring = false }: { showScoring?: boolean }) {
  const { t } = useLanguage();

  return (
    <section className="relative w-full section-padding overflow-hidden border-t border-white/10">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t(TRANSLATIONS.features.title)}
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {t(TRANSLATIONS.features.subtitle)}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {CARDS.map((card, i) => (
            <div key={i} className="relative bg-[#111111] rounded-2xl p-8 shadow-lg card-lift overflow-hidden border border-[#222] hover:border-[#333] transition-all group">
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <IconBadge icon={card.icon} variant={card.variant} />
              <h3 className="text-xl font-semibold text-white mt-6 mb-3">
                {t(card.titleKey)}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {t(card.descKey)}
              </p>
            </div>
          ))}
        </div>

        {showScoring && (
          <div className="mt-10 rounded-2xl border border-white/10 bg-black/20 p-5 sm:p-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white mb-3">
              {t(TRANSLATIONS.scoring.title)}
            </h3>
            <div className="text-sm text-slate-300 space-y-2">
              <p>1. {t(TRANSLATIONS.scoring.step1)}</p>
              <p>2. {t(TRANSLATIONS.scoring.step2)}</p>
              <p>3. {t(TRANSLATIONS.scoring.step3)}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
