'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { AnalysisResult } from '@/types';
import { analyzePrompt } from '@/engine/analyzer';

async function fetchAiInsights(
  prompt: string,
  language: string,
  riskScore: number,
  qualityScore: number,
  signal: AbortSignal
): Promise<string | null> {
  try {
    const res = await fetch('/api/ai-insights', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, language, riskScore, qualityScore }),
      signal,
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
  const [aiInsights, setAiInsights] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const analyze = useCallback((text?: string, language?: string) => {
    const input = text ?? prompt;
    if (!input.trim()) return;

    // Reset AI state
    setAiInsights(null);
    setIsAiLoading(false);
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsAnalyzing(true);

    const analysisResult = analyzePrompt(input);
    if (!mountedRef.current) return;
    setResult(analysisResult);
    setIsAnalyzing(false);

    // Fire AI fetch (non-blocking, after heuristic results shown)
    setIsAiLoading(true);
    const lang = language ?? 'en';
    fetchAiInsights(
      input,
      lang,
      analysisResult.security.riskScore,
      analysisResult.quality.qualityScore,
      controller.signal
    ).then((insights) => {
      if (!mountedRef.current || controller.signal.aborted) return;
      setAiInsights(insights);
      setIsAiLoading(false);
    });
  }, [prompt]);

  const clear = useCallback(() => {
    setPrompt('');
    setResult(null);
    setAiInsights(null);
    setIsAiLoading(false);
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
    aiInsights,
    isAiLoading,
    analyze,
    clear,
    loadExample,
  };
}
