'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { AnalysisResult } from '@/types';
import { analyzePrompt } from '@/engine/analyzer';

const CLIENT_AI_TIMEOUT_MS = 20_000; // 20s client-side safety net

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
  const aiTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finalizeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const analyzeLockRef = useRef(false);
  const mountedRef = useRef(true);
  // Store last analysis context for retry
  const lastAnalysisRef = useRef<{
    prompt: string;
    language: string;
    riskScore: number;
    qualityScore: number;
  } | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      analyzeLockRef.current = false;
      if (finalizeTimerRef.current) clearTimeout(finalizeTimerRef.current);
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, []);

  const analyze = useCallback((text?: string, language?: string) => {
    if (analyzeLockRef.current) return;
    const input = text ?? prompt;
    if (!input.trim()) return;
    analyzeLockRef.current = true;

    // Reset AI state
    setAiInsights(null);
    setIsAiLoading(false);
    if (abortRef.current) abortRef.current.abort();
    if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
    if (finalizeTimerRef.current) clearTimeout(finalizeTimerRef.current);
    const controller = new AbortController();
    abortRef.current = controller;

    setIsAnalyzing(true);

    const analysisResult = analyzePrompt(input);
    // Keep a tiny visual delay so the analyzing border animation is visible.
    finalizeTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setResult(analysisResult);
      setIsAnalyzing(false);
      analyzeLockRef.current = false;

      // Fire AI fetch (non-blocking, after heuristic results shown)
      setIsAiLoading(true);
      const lang = language ?? 'en';

      // Store context for retry
      lastAnalysisRef.current = {
        prompt: input,
        language: lang,
        riskScore: analysisResult.security.riskScore,
        qualityScore: analysisResult.quality.qualityScore,
      };

      // Client-side timeout safety net (slightly longer than server-side 15s)
      aiTimeoutRef.current = setTimeout(() => controller.abort(), CLIENT_AI_TIMEOUT_MS);

      fetchAiInsights(
        input,
        lang,
        analysisResult.security.riskScore,
        analysisResult.quality.qualityScore,
        controller.signal
      ).then((insights) => {
        if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
        if (!mountedRef.current || controller.signal.aborted) return;
        setAiInsights(insights);
        setIsAiLoading(false);
      });
    }, 180);
  }, [prompt]);

  const clear = useCallback(() => {
    setPrompt('');
    setResult(null);
    setAiInsights(null);
    setIsAiLoading(false);
    analyzeLockRef.current = false;
    if (finalizeTimerRef.current) clearTimeout(finalizeTimerRef.current);
    if (abortRef.current) abortRef.current.abort();
  }, []);

  const retryAi = useCallback(() => {
    const ctx = lastAnalysisRef.current;
    if (!ctx || isAiLoading) return;

    // Abort any previous AI request
    if (abortRef.current) abortRef.current.abort();
    if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);

    const controller = new AbortController();
    abortRef.current = controller;

    setAiInsights(null);
    setIsAiLoading(true);

    aiTimeoutRef.current = setTimeout(() => controller.abort(), CLIENT_AI_TIMEOUT_MS);

    fetchAiInsights(
      ctx.prompt,
      ctx.language,
      ctx.riskScore,
      ctx.qualityScore,
      controller.signal
    ).then((insights) => {
      if (aiTimeoutRef.current) clearTimeout(aiTimeoutRef.current);
      if (!mountedRef.current || controller.signal.aborted) return;
      setAiInsights(insights);
      setIsAiLoading(false);
    });
  }, [isAiLoading]);

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
    retryAi,
  };
}
