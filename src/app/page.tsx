'use client';

import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { PromptInput } from '@/components/PromptInput';
import { ResultsTabs } from '@/components/ResultsTabs';
import { ExampleLibrary } from '@/components/ExampleLibrary';
import { EducationSection } from '@/components/EducationSection';
import { Footer } from '@/components/Footer';
import { useAnalysis } from '@/hooks/useAnalysis';

export default function Home() {
  const { prompt, setPrompt, result, isAnalyzing, analyze, clear, loadExample } = useAnalysis();

  // Handle shared URL parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const p = params.get('p');
    if (p) {
      try {
        const decoded = decodeURIComponent(atob(p));
        // Simple decode for now
        setPrompt(decoded);
        setTimeout(() => {
          analyze(decoded);
        }, 100);
      } catch {
        // Invalid parameter
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnalyze = (text?: string) => {
    analyze(text);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col">
        {/* HERO SECTION — vertically centered in viewport */}
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 120px)' }}>
          <PromptInput
            value={prompt}
            onChange={setPrompt}
            onAnalyze={() => handleAnalyze()}
            onClear={clear}
            isAnalyzing={isAnalyzing}
          />
        </div>

        {/* MASSIVE GAP - Lovable Style */}
        <div style={{ height: '70vh' }} />

        {/* RESULTS / EXAMPLES SECTION - WHITE */}
        <section className="relative bg-white py-24 w-full">
          {/* Top fade from gradient to white */}
          <div
            className="absolute inset-x-0 pointer-events-none"
            style={{
              top: '-35vh',
              height: '40vh',
              background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.7) 60%, white 100%)',
              zIndex: -1
            }}
          />

          <div className="w-full max-w-6xl mx-auto px-4 animate-fade-in">
            {result ? (
              <ResultsTabs result={result} />
            ) : (
              /* EMPTY STATE / EXAMPLES */
              <div className="max-w-2xl mx-auto mt-0 animate-fade-in delay-100">
                <ExampleLibrary
                  onLoadExample={loadExample}
                  onAnalyze={(p) => handleAnalyze(p)}
                />
              </div>
            )}
          </div>
        </section>

        {/* LEARN MORE - WHITE WITH LIGHT GRAY BG */}
        <section className="bg-gray-50 py-24">
          <EducationSection />
        </section>

        <Footer />
      </main>
    </div>
  );
}
