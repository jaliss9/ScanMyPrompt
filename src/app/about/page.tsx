'use client';

import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { TRANSLATIONS } from '@/config/i18n';
import { GlassCard } from '@/components/ui/GlassCard';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const STEPS = [
  {
    num: '1',
    title: TRANSLATIONS.about.step1Title,
    desc: TRANSLATIONS.about.step1Desc,
    icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
      </svg>
    ),
  },
  {
    num: '2',
    title: TRANSLATIONS.about.step2Title,
    desc: TRANSLATIONS.about.step2Desc,
    icon: (
      <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
  },
  {
    num: '3',
    title: TRANSLATIONS.about.step3Title,
    desc: TRANSLATIONS.about.step3Desc,
    icon: (
      <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
      </svg>
    ),
  },
];

const FEATURES = [
  { title: TRANSLATIONS.about.featSecurity, desc: TRANSLATIONS.about.featSecurityDesc, emoji: '\uD83D\uDD12' },
  { title: TRANSLATIONS.about.featQuality, desc: TRANSLATIONS.about.featQualityDesc, emoji: '\u2728' },
  { title: TRANSLATIONS.about.featBilingual, desc: TRANSLATIONS.about.featBilingualDesc, emoji: '\uD83C\uDF10' },
  { title: TRANSLATIONS.about.featPrivacy, desc: TRANSLATIONS.about.featPrivacyDesc, emoji: '\uD83D\uDEE1\uFE0F' },
  { title: TRANSLATIONS.about.featEducation, desc: TRANSLATIONS.about.featEducationDesc, emoji: '\uD83D\uDCDA' },
  { title: TRANSLATIONS.about.featBYOK, desc: TRANSLATIONS.about.featBYOKDesc, emoji: '\uD83D\uDD11' },
];

const TECH_BADGES = ['Next.js', 'TypeScript', 'Tailwind CSS', 'OWASP LLM Top 10', 'Vercel'];

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 w-full">
        {/* Hero */}
        <section className="pt-8 sm:pt-12 pb-12 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Link
              href="/"
              className="inline-block text-sm text-gray-500 hover:text-gray-900 transition-colors mb-8"
            >
              {t(TRANSLATIONS.about.backToTool)}
            </Link>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
              {t(TRANSLATIONS.about.title)}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {t(TRANSLATIONS.about.subtitle)}
            </p>
          </div>
        </section>

        <div className="bg-white w-full">
          <div className="max-w-4xl mx-auto px-4 py-16 space-y-20">

            {/* Why this tool? */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t(TRANSLATIONS.about.whyTitle)}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t(TRANSLATIONS.about.whyDesc)}
              </p>
            </section>

            {/* How it works — 3 steps */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                {t(TRANSLATIONS.about.howTitle)}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {STEPS.map((step) => (
                  <GlassCard key={step.num} className="text-center relative !rounded-2xl">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gray-900 text-white text-sm font-bold flex items-center justify-center shadow-md">
                      {step.num}
                    </div>
                    <div className="flex justify-center mt-2 mb-4">
                      {step.icon}
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">
                      {t(step.title)}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {t(step.desc)}
                    </p>
                  </GlassCard>
                ))}
              </div>
            </section>

            {/* Features grid */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                {t(TRANSLATIONS.about.featuresTitle)}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {FEATURES.map((feat, i) => (
                  <GlassCard key={i} className="!rounded-2xl">
                    <span className="text-2xl mb-3 block">{feat.emoji}</span>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
                      {t(feat.title)}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {t(feat.desc)}
                    </p>
                  </GlassCard>
                ))}
              </div>
            </section>

            {/* Who is it for? */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t(TRANSLATIONS.about.forWhoTitle)}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {t(TRANSLATIONS.about.forWhoDesc)}
              </p>
            </section>

            {/* Tech stack */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t(TRANSLATIONS.about.techTitle)}
              </h2>
              <div className="flex flex-wrap gap-2">
                {TECH_BADGES.map((badge) => (
                  <span
                    key={badge}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border border-gray-200"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="text-center pt-4 pb-8">
              <Link
                href="/"
                className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-all duration-200 hover:scale-105 active:scale-95 shadow-md shadow-blue-600/20"
              >
                {t(TRANSLATIONS.about.cta)}
              </Link>
            </section>

          </div>
        </div>

        {/* Footer Area */}
        <div className="mt-auto border-t border-gray-200">
          <Footer />
        </div>
      </main>
    </div>
  );
}
