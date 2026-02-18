'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/Header';
import { PromptInput } from '@/components/PromptInput';
import { AIInsights } from '@/components/AIInsights';
import { ResultsTabs } from '@/components/ResultsTabs';
import { Footer } from '@/components/Footer';
import { IconBadge } from '@/components/ui/IconBadge';
import { ZapIcon, CheckCircleIcon, SparklesIcon } from '@/components/ui/Icons';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { useAnalysis } from '@/hooks/useAnalysis';
import { useLanguage } from '@/hooks/useLanguage';
import { TRANSLATIONS } from '@/config/i18n';
import { useToast } from '@/components/Toast';
import { extractImprovedPromptFromInsights } from '@/utils/aiInsights';
import { copyTextToClipboard } from '@/utils/clipboard';
import { generateMarkdownReport, downloadMarkdown } from '@/utils/exportMarkdown';

const loadExampleLibrary = () => import('@/components/ExampleLibrary');
const loadEducationSection = () => import('@/components/EducationSection');

const ExampleLibrary = dynamic(() => loadExampleLibrary().then((m) => m.ExampleLibrary), {
  ssr: false,
});

const EducationSection = dynamic(() => loadEducationSection().then((m) => m.EducationSection), {
  ssr: false,
});

export default function Home() {
  const { language, t } = useLanguage();
  const { prompt, setPrompt, result, isAnalyzing, aiInsights, isAiLoading, analyze, clear, loadExample, retryAi } = useAnalysis();
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

    const idleApi = globalThis as typeof globalThis & {
      requestIdleCallback?: (callback: IdleRequestCallback, options?: IdleRequestOptions) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (typeof idleApi.requestIdleCallback === 'function' && typeof idleApi.cancelIdleCallback === 'function') {
      const id = idleApi.requestIdleCallback(preload, { timeout: 1400 });
      return () => idleApi.cancelIdleCallback!(id);
    }

    const timeout = setTimeout(preload, 700);
    return () => clearTimeout(timeout);
  }, []);

  // Scroll to verdict when a new result arrives
  useEffect(() => {
    const ts = result?.timestamp ?? null;
    if (ts && ts !== prevTimestampRef.current) {
      prevTimestampRef.current = ts;
      setTimeout(() => {
        const verdict = document.getElementById('verdict');
        if (!verdict) return;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        verdict.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
      }, 100);
    }
  }, [result?.timestamp]);

  // Handle shared URL parameter — load the prompt but let the user decide to analyze
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get('p');
    if (p) {
      try {
        const decoded = decodeURIComponent(atob(p));
        setPrompt(decoded);
        // Remove the query param from the URL to avoid re-loading on refresh
        window.history.replaceState({}, '', window.location.pathname);
      } catch {
        // Invalid parameter — ignore silently
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnalyze = useCallback((text?: string) => {
    setShowDetails(false);
    analyze(text, language);
  }, [analyze, language]);

  const hasImprovedPrompt = !!result && result.quality.improvedVersion !== result.prompt;
  const handleCopyImproved = useCallback(async () => {
    if (!result) return;
    const improvedFromInsights = aiInsights
      ? extractImprovedPromptFromInsights(aiInsights)
      : null;
    const textToCopy = improvedFromInsights ?? result.quality.improvedVersion;
    const copied = await copyTextToClipboard(textToCopy);
    if (copied) {
      showToast(t(TRANSLATIONS.security.copied));
    }
  }, [aiInsights, result, showToast, t]);

  const handleExport = useCallback(() => {
    if (!result) return;
    const lang = language === 'fr' ? 'fr' as const : 'en' as const;
    const md = generateMarkdownReport(result, aiInsights, lang);
    const filename = `${t(TRANSLATIONS.export.filename)}-${new Date().toISOString().slice(0, 10)}.md`;
    downloadMarkdown(md, filename);
  }, [result, aiInsights, language, t]);

  const handleCopySummary = useCallback(async () => {
    if (!result) return;
    const action = result.security.detections.length > 0
      ? (language === 'fr'
        ? 'Corriger les zones risquées avec la réécriture sécurisée.'
        : 'Fix risky zones with the safe rewrite.')
      : (language === 'fr'
        ? 'Renforcer le prompt avec les suggestions qualité.'
        : 'Strengthen the prompt with quality suggestions.');
    const summary = [
      `Risk: ${result.security.riskScore}/5`,
      `Quality: ${result.quality.qualityScore}/5`,
      `Detections: ${result.security.detections.length}`,
      `Suggestions: ${result.quality.suggestions.length}`,
      `Next action: ${action}`,
    ].join('\n');
    const copied = await copyTextToClipboard(summary);
    if (copied) showToast(t(TRANSLATIONS.security.copied));
  }, [language, result, showToast, t]);

  return (
    <div className="min-h-screen flex flex-col bg-[#030305]">
      <Header />

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
          {!result && (
            <>
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -left-16 h-[20rem] w-[20rem] rounded-full bg-cyan-500/9 blur-[105px] animate-soft-drift" />
                <div className="absolute top-[24%] right-[-6%] h-[18rem] w-[18rem] rounded-full bg-violet-500/10 blur-[105px] animate-soft-drift-alt" />
                <div className="absolute inset-x-0 top-[20%] h-24 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.14),transparent_72%)] blur-2xl animate-ambient-sweep" />
              </div>
            </>
          )}

          {result && (
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute top-[18%] left-[8%] h-48 w-48 rounded-full bg-cyan-500/8 blur-[85px] animate-soft-drift-alt" />
              <div className="absolute bottom-[12%] right-[10%] h-44 w-44 rounded-full bg-fuchsia-500/8 blur-[80px] animate-soft-drift" />
            </div>
          )}

          {/* Decorative floating elements */}
          {!result && (
            <>
              <div className="absolute top-1/4 left-10 w-20 h-20 bg-white/5 rounded-full blur-3xl animate-pulse stagger-in stagger-1" />
              <div className="absolute bottom-1/4 right-10 w-28 h-28 bg-pink-400/7 rounded-full blur-3xl animate-pulse delay-700 stagger-in stagger-2" />
            </>
          )}

          {/* Smooth Fade to Next Section */}
          {!result && (
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#030305] via-[#030305]/80 to-transparent pointer-events-none z-0" />
          )}

          <div className="w-full max-w-5xl relative z-10">
            {/* Hero text — collapses when results are shown */}
            {!result && (
              <div className="text-center mb-10 sm:mb-16">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6 tracking-tight drop-shadow-sm stagger-in stagger-1">
                  {t(TRANSLATIONS.hero.title)}
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl text-white/80 max-w-2xl mx-auto stagger-in stagger-2">
                  {t(TRANSLATIONS.hero.tagline)}
                </p>
              </div>
            )}

            {/* Prompt Input */}
            <div className="stagger-in stagger-3">
              <PromptInput
                value={prompt}
                onChange={setPrompt}
                onAnalyze={() => handleAnalyze()}
                onClear={clear}
                isAnalyzing={isAnalyzing}
                isBusy={isAiLoading}
              />
            </div>

            {(isAnalyzing || isAiLoading || result) && (
              <div className="mt-3 text-center">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs text-slate-300">
                  <span className={`w-1.5 h-1.5 rounded-full ${isAnalyzing || isAiLoading ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-400'}`} />
                  {isAnalyzing
                    ? (language === 'fr' ? 'Analyse locale en cours...' : 'Running local analysis...')
                    : isAiLoading
                      ? (language === 'fr' ? 'Affinage IA en cours...' : 'Running AI refinement...')
                      : (language === 'fr' ? 'Analyse terminée' : 'Analysis complete')}
                </span>
              </div>
            )}

            {/* Results — directly under prompt */}
            {result && (
              <div className="mt-6 sm:mt-10 space-y-4 animate-fade-in max-w-6xl mx-auto">
                <div id="verdict" className="bg-[#121821] rounded-2xl border border-[#273142] p-5 sm:p-6">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-white">
                        {language === 'fr' ? 'Résumé de l’analyse' : 'Analysis summary'}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopySummary}
                        className="px-2.5 py-1 text-xs text-slate-300 border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] rounded-md transition-colors"
                      >
                        {language === 'fr' ? 'Copier le résumé' : 'Copy summary'}
                      </button>
                      <button
                        type="button"
                        onClick={handleExport}
                        className="px-2.5 py-1 text-xs text-slate-300 border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] rounded-md transition-colors"
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
                      {result.security.detections.length} {language === 'fr' ? 'détections' : 'detections'}
                    </div>
                    <div className="text-xs text-slate-400">
                      {result.quality.suggestions.length} {language === 'fr' ? 'suggestions' : 'suggestions'}
                    </div>
                  </div>

                  <div className="text-sm text-slate-200 rounded-xl border border-white/10 bg-black/20 p-3">
                    {result.security.detections.length > 0
                      ? (language === 'fr'
                        ? 'Action prioritaire: corriger les zones risquées avec la réécriture sécurisée, puis vérifier la version améliorée.'
                        : 'Priority action: fix risky zones with the safe rewrite, then validate the improved version.')
                      : (language === 'fr'
                        ? 'Action prioritaire: appliquer la première suggestion qualité pour renforcer le prompt.'
                        : 'Priority action: apply the first quality suggestion to strengthen your prompt.')}
                  </div>
                </div>

                {/* AI Insights — between verdict and details */}
                <AIInsights
                  insights={aiInsights}
                  isLoading={isAiLoading}
                  onCopyImproved={hasImprovedPrompt ? handleCopyImproved : undefined}
                  onRetry={retryAi}
                  showUnavailable={!!result && !isAiLoading && !aiInsights}
                />

                {/* Details panel — hidden by default */}
                {showDetails && (
                  <div id="analysis-details" className="animate-fade-in">
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

              <div className="mt-10 rounded-2xl border border-white/10 bg-black/20 p-5 sm:p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-white mb-3">
                  {language === 'fr' ? 'Comment le scoring fonctionne' : 'How scoring works'}
                </h3>
                <div className="text-sm text-slate-300 space-y-2">
                  <p>1. {language === 'fr' ? 'Détection de motifs OWASP + signaux de risque.' : 'OWASP pattern detection + risk signals.'}</p>
                  <p>2. {language === 'fr' ? 'Évaluation qualité sur 6 dimensions.' : 'Quality evaluation across 6 dimensions.'}</p>
                  <p>3. {language === 'fr' ? 'Sorties actionnables : réécriture sûre + prompt amélioré.' : 'Actionable outputs: safe rewrite + improved prompt.'}</p>
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

      <button
        type="button"
        onClick={() => setShowExtended((v) => !v)}
        className="fixed right-4 bottom-4 z-40 px-3 py-2 text-xs font-medium text-slate-200 bg-black/50 border border-white/15 rounded-lg backdrop-blur-md hover:bg-black/65 transition-colors"
      >
        {t(showExtended ? TRANSLATIONS.mode.compact : TRANSLATIONS.mode.full)}
      </button>

      {result && (
        <button
          type="button"
          onClick={() => setShowDetails((v) => !v)}
          aria-expanded={showDetails}
          aria-controls="analysis-details"
          className="fixed right-4 bottom-16 z-40 px-3 py-2 text-xs font-medium text-slate-200 bg-black/50 border border-white/15 rounded-lg backdrop-blur-md hover:bg-black/65 transition-colors"
        >
          {showDetails
            ? t(TRANSLATIONS.verdict.hideDetails)
            : `${t(TRANSLATIONS.verdict.seeDetails)} · ${result.security.detections.length} ${language === 'fr' ? 'risques' : 'risks'} · ${result.quality.suggestions.length} ${language === 'fr' ? 'suggestions' : 'suggestions'}`}
        </button>
      )}

      <Footer />
    </div>
  );
}
