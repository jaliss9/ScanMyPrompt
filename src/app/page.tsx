'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { PromptInput } from '@/components/PromptInput';
import { Verdict } from '@/components/Verdict';
import { AIInsights } from '@/components/AIInsights';
import { ResultsTabs } from '@/components/ResultsTabs';
import { Footer } from '@/components/Footer';
import { ScanningOverlay } from '@/components/ScanningOverlay';
import { PatternCounter } from '@/components/PatternCounter';
import { IconBadge } from '@/components/ui/IconBadge';
import { ZapIcon, CheckCircleIcon, SparklesIcon } from '@/components/ui/Icons';
import { useAnalysis } from '@/hooks/useAnalysis';
import { useLanguage } from '@/hooks/useLanguage';
import { TRANSLATIONS } from '@/config/i18n';
import { useToast } from '@/components/Toast';

const loadExampleLibrary = () => import('@/components/ExampleLibrary');
const loadEducationSection = () => import('@/components/EducationSection');

const ExampleLibrary = dynamic(() => loadExampleLibrary().then((m) => m.ExampleLibrary), {
  ssr: false,
});

const EducationSection = dynamic(() => loadEducationSection().then((m) => m.EducationSection), {
  ssr: false,
});

function extractImprovedPromptFromInsights(insights: string): string | null {
  const lines = insights.split('\n');
  const headingPattern = /^\s*(#{2,4}\s*)?(version améliorée du prompt|improved prompt version)\s*$/i;
  const nextHeadingPattern = /^\s*#{2,4}\s+\S+/;

  const startIndex = lines.findIndex((line) => headingPattern.test(line.trim()));
  if (startIndex === -1) return null;

  const collected: string[] = [];
  for (let i = startIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (nextHeadingPattern.test(line.trim())) break;
    collected.push(line);
  }

  const extracted = collected.join('\n').trim();
  return extracted.length > 0 ? extracted : null;
}

export default function Home() {
  const { language, t } = useLanguage();
  const { prompt, setPrompt, result, isAnalyzing, scanProgress, aiInsights, isAiLoading, analyze, clear, loadExample } = useAnalysis();
  const { showToast } = useToast();
  const [showDetails, setShowDetails] = useState(false);
  const [showExtended, setShowExtended] = useState(false);
  const prevTimestampRef = useRef<string | null>(null);

  // Preload heavy sections after first paint for snappier "full mode".
  useEffect(() => {
    const preload = () => {
      void loadExampleLibrary();
      void loadEducationSection();
    };

    if (typeof window === 'undefined') return;
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(preload, { timeout: 1400 });
      return () => window.cancelIdleCallback(id);
    }

    const timeout = window.setTimeout(preload, 700);
    return () => window.clearTimeout(timeout);
  }, []);

  // Scroll to verdict when a new result arrives
  useEffect(() => {
    const ts = result?.timestamp ?? null;
    if (ts && ts !== prevTimestampRef.current) {
      prevTimestampRef.current = ts;
      setTimeout(() => {
        document.getElementById('verdict')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [result?.timestamp]);

  // Handle shared URL parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get('p');
    if (p) {
      try {
        const decoded = decodeURIComponent(atob(p));
        setPrompt(decoded);
        setTimeout(() => {
          analyze(decoded, language);
        }, 100);
      } catch {
        // Invalid parameter
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnalyze = useCallback((text?: string) => {
    setShowDetails(false);
    analyze(text, language);
  }, [analyze, language]);

  const hasImprovedPrompt = !!result && result.quality.improvedVersion !== result.prompt;

  const handleCopyImproved = useCallback(() => {
    if (!result) return;
    const improvedFromInsights = aiInsights
      ? extractImprovedPromptFromInsights(aiInsights)
      : null;
    const textToCopy = improvedFromInsights ?? result.quality.improvedVersion;
    navigator.clipboard.writeText(textToCopy);
    showToast(t(TRANSLATIONS.security.copied));
  }, [aiInsights, result, showToast, t]);

  return (
    <div className="min-h-screen flex flex-col bg-[#030305]">
      <Header />

      {/* Scanning Overlay */}
      <ScanningOverlay isVisible={isAnalyzing} progress={scanProgress} />

      <main className="flex-1 flex flex-col">
        {/* HERO + PROMPT + RESULTS — all in one flow */}
        <div
          className="relative p-4 pb-14 sm:pb-20 transition-all duration-700 ease-out"
          style={{
            minHeight: result ? 'calc(100vh - 84px)' : 'calc(100vh - 84px)',
            paddingTop: result ? '2rem' : undefined,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: result ? 'flex-start' : 'center',
          }}
        >
          {/* Decorative floating elements */}
          {!result && (
            <>
              <div className="absolute top-1/4 left-10 w-24 h-24 bg-white/5 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-700" />
            </>
          )}

          {/* Smooth Fade to Next Section */}
          {!result && (
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#030305] via-[#030305]/80 to-transparent pointer-events-none z-0" />
          )}

          <div className="w-full max-w-5xl relative z-10">
            {/* Hero text — collapses when results are shown */}
            {!result && (
              <div className="text-center mb-16 animate-fade-in">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6 tracking-tight drop-shadow-sm">
                  {t(TRANSLATIONS.hero.title)}
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
                  {t(TRANSLATIONS.hero.tagline)}
                </p>
              </div>
            )}

            {/* Prompt Input */}
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              onAnalyze={() => handleAnalyze()}
              onClear={clear}
              isAnalyzing={isAnalyzing}
            />

            {/* Results — directly under prompt */}
            {result && (
              <div className="mt-12 space-y-8 animate-fade-in max-w-6xl mx-auto">
                <PatternCounter issuesFound={result.security.detections.length} />

                <Verdict
                  result={result}
                  showDetails={showDetails}
                  onToggleDetails={() => setShowDetails((v) => !v)}
                />

                {/* AI Insights — between verdict and details */}
                <AIInsights
                  insights={aiInsights}
                  isLoading={isAiLoading}
                  onCopyImproved={hasImprovedPrompt ? handleCopyImproved : undefined}
                  onToggleDetails={() => setShowDetails((v) => !v)}
                  showDetails={showDetails}
                />

                {/* Details panel — hidden by default */}
                {showDetails && (
                  <div className="animate-fade-in">
                    <ResultsTabs result={result} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {!showExtended && !result && (
          <section id="features-compact" className="relative w-full pb-14 pt-2 overflow-hidden border-t border-white/10">
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
                <div className="relative bg-[#111111] rounded-2xl p-8 shadow-lg card-lift overflow-hidden border border-[#222] hover:border-[#333] transition-all group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <IconBadge icon={<ZapIcon />} variant="primary" />
                  <h3 className="text-xl font-semibold text-white mt-6 mb-3">
                    {t(TRANSLATIONS.features.instantTitle)}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {t(TRANSLATIONS.features.instantDesc)}
                  </p>
                </div>

                <div className="relative bg-[#111111] rounded-2xl p-8 shadow-lg card-lift overflow-hidden border border-[#222] hover:border-[#333] transition-all group">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <IconBadge icon={<CheckCircleIcon />} variant="success" />
                  <h3 className="text-xl font-semibold text-white mt-6 mb-3">
                    {t(TRANSLATIONS.features.owaspTitle)}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {t(TRANSLATIONS.features.owaspDesc)}
                  </p>
                </div>

                <div className="relative bg-[#111111] rounded-2xl p-8 shadow-lg card-lift overflow-hidden border border-[#222] hover:border-[#333] transition-all group">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <IconBadge icon={<SparklesIcon />} variant="primary" />
                  <h3 className="text-xl font-semibold text-white mt-6 mb-3">
                    {t(TRANSLATIONS.features.autoTitle)}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {t(TRANSLATIONS.features.autoDesc)}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {showExtended && (
          <div className="animate-fade-in">
            <section id="features" className="relative section-padding overflow-hidden border-y border-white/10">
              <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10 max-w-6xl mx-auto px-4">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {t(TRANSLATIONS.features.title)}
                  </h2>
                  <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                    {t(TRANSLATIONS.features.subtitle)}
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="relative bg-[#111111] rounded-2xl p-8 shadow-lg card-lift overflow-hidden border border-[#222] hover:border-[#333] transition-all group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <IconBadge icon={<ZapIcon />} variant="primary" />
                    <h3 className="text-xl font-semibold text-white mt-6 mb-3">
                      {t(TRANSLATIONS.features.instantTitle)}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {t(TRANSLATIONS.features.instantDesc)}
                    </p>
                  </div>

                  <div className="relative bg-[#111111] rounded-2xl p-8 shadow-lg card-lift overflow-hidden border border-[#222] hover:border-[#333] transition-all group">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <IconBadge icon={<CheckCircleIcon />} variant="success" />
                    <h3 className="text-xl font-semibold text-white mt-6 mb-3">
                      {t(TRANSLATIONS.features.owaspTitle)}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {t(TRANSLATIONS.features.owaspDesc)}
                    </p>
                  </div>

                  <div className="relative bg-[#111111] rounded-2xl p-8 shadow-lg card-lift overflow-hidden border border-[#222] hover:border-[#333] transition-all group">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <IconBadge icon={<SparklesIcon />} variant="primary" />
                    <h3 className="text-xl font-semibold text-white mt-6 mb-3">
                      {t(TRANSLATIONS.features.autoTitle)}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {t(TRANSLATIONS.features.autoDesc)}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {!result && (
              <section id="examples" className="relative section-padding w-full border-t border-white/10">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-20 right-20 w-72 h-72 bg-pink-500/5 rounded-full blur-3xl opacity-35" />
                </div>
                <div className="w-full max-w-6xl mx-auto px-4 animate-fade-in relative z-10">
                  <div className="max-w-5xl mx-auto">
                    <ExampleLibrary
                      onLoadExample={loadExample}
                      onAnalyze={(p) => handleAnalyze(p)}
                    />
                  </div>
                </div>
              </section>
            )}

            <section id="learn" className="relative section-padding border-t border-white/10 overflow-hidden">
              <div className="absolute left-0 bottom-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-70" />
              <div className="absolute top-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000" />
              <div className="relative z-10">
                <EducationSection />
              </div>
            </section>
          </div>
        )}
      </main>

      <div className="pb-4 text-center">
        <span className="text-[11px] text-slate-500">{t(TRANSLATIONS.ai.poweredBy)}</span>
      </div>

      <button
        type="button"
        onClick={() => setShowExtended((v) => !v)}
        className="fixed right-4 bottom-4 z-40 px-3 py-2 text-xs font-medium text-slate-200 bg-black/50 border border-white/15 rounded-lg backdrop-blur-md hover:bg-black/65 transition-colors"
      >
        {showExtended
          ? language === 'fr' ? 'Mode épuré' : 'Compact mode'
          : language === 'fr' ? 'Mode complet' : 'Full mode'}
      </button>

      <Footer />
    </div>
  );
}
