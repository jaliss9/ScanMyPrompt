'use client';

import { useState, useCallback, useRef } from 'react';
import type { AnalysisResult } from '@/types';
import { analyzePrompt } from '@/engine/analyzer';

async function fetchAiInsights(
  prompt: string,
  language: string,
  riskScore: number,
  qualityScore: number
): Promise<string | null> {
  try {
    const res = await fetch('/api/ai-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, language, riskScore, qualityScore }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.insights ?? null;
  } catch {
    return null;
  }
}

export function useAnalysis() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const analyze = useCallback((text?: string, language?: string) => {
    const input = text ?? prompt;
    if (!input.trim()) return;

    // Reset AI state
    setAiInsights(null);
    setIsAiLoading(false);
    if (abortRef.current) abortRef.current.abort();

    setIsAnalyzing(true);
    setScanProgress(0);

    // Start progress animation
    let progress = 0;
    intervalRef.current = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 90) {
        progress = 90;
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      setScanProgress(Math.min(progress, 90));
    }, 120);

    // Actual analysis with minimum duration for UX (800ms)
    setTimeout(() => {
      const analysisResult = analyzePrompt(input);

      // Clear interval and jump to 100%
      if (intervalRef.current) clearInterval(intervalRef.current);
      setScanProgress(100);

      // Brief pause at 100% before showing results
      setTimeout(() => {
        setResult(analysisResult);
        setIsAnalyzing(false);
        setScanProgress(0);

        // Fire AI fetch (non-blocking, after heuristic results shown)
        setIsAiLoading(true);
        const lang = language ?? 'en';
        fetchAiInsights(
          input,
          lang,
          analysisResult.security.riskScore,
          analysisResult.quality.qualityScore
        ).then((insights) => {
          setAiInsights(insights);
          setIsAiLoading(false);
        });
      }, 400);
    }, 800);
  }, [prompt]);

  const clear = useCallback(() => {
    setPrompt('');
    setResult(null);
    setAiInsights(null);
    setIsAiLoading(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (abortRef.current) abortRef.current.abort();
  }, []);

  const loadExample = useCallback((examplePrompt: string) => {
    setPrompt(examplePrompt);
    setResult(null);
    setAiInsights(null);
  }, []);

  return {
    prompt,
    setPrompt,
    result,
    isAnalyzing,
    scanProgress,
    aiInsights,
    isAiLoading,
    analyze,
    clear,
    loadExample,
  };
}
