'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { TRANSLATIONS } from '@/config/i18n';
import { GlassCard } from '@/components/ui/GlassCard';
import { Header } from '@/components/Header';
import { EducationSection } from '@/components/EducationSection';
import { Footer } from '@/components/Footer';
import { ANALYSIS_METRICS } from '@/engine/metrics';

const STEPS = [
  {
    num: '1',
    title: TRANSLATIONS.about.step1Title,
    desc: TRANSLATIONS.about.step1Desc,
    icon: (
      <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
      </svg>
    ),
  },
  {
    num: '2',
    title: TRANSLATIONS.about.step2Title,
    desc: TRANSLATIONS.about.step2Desc,
    icon: (
      <svg className="w-6 h-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    num: '3',
    title: TRANSLATIONS.about.step3Title,
    desc: TRANSLATIONS.about.step3Desc,
    icon: (
      <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
];

const FEATURES = [
  { title: TRANSLATIONS.about.featSecurity, desc: TRANSLATIONS.about.featSecurityDesc, emoji: '\uD83D\uDD12' },
  { title: TRANSLATIONS.about.featQuality, desc: TRANSLATIONS.about.featQualityDesc, emoji: '\u2728' },
  { title: TRANSLATIONS.about.featPrivacy, desc: TRANSLATIONS.about.featPrivacyDesc, emoji: '\uD83D\uDEE1\uFE0F' },
  { title: TRANSLATIONS.about.featEducation, desc: TRANSLATIONS.about.featEducationDesc, emoji: '\uD83D\uDCDA' },
  { title: TRANSLATIONS.about.featBYOK, desc: TRANSLATIONS.about.featBYOKDesc, emoji: '\uD83D\uDD11' },
];

export default function AboutPage() {
  const { t, language } = useLanguage();
  const [showLearnDetails, setShowLearnDetails] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#030305] text-white">
      <Header />

      <main className="flex-1 w-full">
        {/* Hero with gradient and stats */}
        <section className="relative section-padding border-b border-white/10 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/8 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
            <Link
              href="/"
              className="inline-block text-sm text-gray-400 hover:text-white transition-colors mb-8"
            >
              {t(TRANSLATIONS.about.backToTool)}
            </Link>

            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
              {t(TRANSLATIONS.about.pageTitle)}
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed mb-12 max-w-2xl mx-auto">
              {t(TRANSLATIONS.about.heroSubtitle)}
            </p>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
              <div>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  {ANALYSIS_METRICS.securityPatterns}
                </p>
                <p className="text-sm text-gray-400 font-medium mt-1">{t(TRANSLATIONS.about.statsPatterns)}</p>
              </div>
              <div className="w-px h-12 bg-gray-700 hidden sm:block" />
              <div>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  {ANALYSIS_METRICS.securityCategories}
                </p>
                <p className="text-sm text-gray-400 font-medium mt-1">{t(TRANSLATIONS.about.statsCategories)}</p>
              </div>
              <div className="w-px h-12 bg-gray-700 hidden sm:block" />
              <div>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  {ANALYSIS_METRICS.qualityDimensions}
                </p>
                <p className="text-sm text-gray-400 font-medium mt-1">{t(TRANSLATIONS.about.statsDimensions)}</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="section-padding border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-white mb-4">
              {t(TRANSLATIONS.about.howTitle)}
            </h2>
            <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
              {t(TRANSLATIONS.about.step1Desc).split('.')[0]}.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {STEPS.map((step) => (
                <div key={step.num} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">{step.num}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {t(step.title)}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {t(step.desc)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why + For who */}
        <section className="section-padding border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="rounded-2xl bg-[#111] border border-[#222] p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t(TRANSLATIONS.about.whyTitle)}
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  {t(TRANSLATIONS.about.whyDesc)}
                </p>
              </div>
              <div className="rounded-2xl bg-[#111] border border-[#222] p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {t(TRANSLATIONS.about.forWhoTitle)}
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  {t(TRANSLATIONS.about.forWhoDesc)}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section className="section-padding border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-8">
              {t(TRANSLATIONS.about.featuresTitle)}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feat, i) => (
                <GlassCard key={i} className="!rounded-2xl !bg-[#111] !border-[#222] hover:!bg-[#151515] transition-colors">
                  <span className="text-2xl mb-3 block">{feat.emoji}</span>
                  <h3 className="text-sm font-semibold text-white mb-1.5">
                    {t(feat.title)}
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {t(feat.desc)}
                  </p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* Learn more — Education */}
        <section id="education" className="section-padding border-t border-white/10">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center text-white mb-4">
              {t(TRANSLATIONS.about.learnMoreTitle)}
            </h2>
            <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
              {t(TRANSLATIONS.about.learnMoreSubtitle)}
            </p>
            <div className="text-center mb-10">
              <button
                type="button"
                onClick={() => setShowLearnDetails((v) => !v)}
                className="px-4 py-2 text-sm text-slate-300 border border-white/15 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] hover:text-white transition-colors"
              >
                {showLearnDetails
                  ? (language === 'fr' ? 'Masquer les détails' : 'Hide details')
                  : (language === 'fr' ? 'Afficher les détails' : 'Show details')}
              </button>
            </div>
            {showLearnDetails && (
              <div className="animate-fade-in">
                <EducationSection showAll showHeader={false} />
              </div>
            )}
          </div>
        </section>

        <div className="mt-auto border-t border-[#1a1a1a]">
          <Footer />
        </div>
      </main>
    </div>
  );
}
