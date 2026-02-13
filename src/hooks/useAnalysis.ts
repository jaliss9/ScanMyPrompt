'use client';

import { useState, useCallback } from 'react';
import type { AnalysisResult } from '@/types';
import { analyzePrompt } from '@/engine/analyzer';

export function useAnalysis() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyze = useCallback((text?: string) => {
    const input = text ?? prompt;
    if (!input.trim()) return;

    setIsAnalyzing(true);

    // Use setTimeout to allow UI to update before heavy computation
    setTimeout(() => {
      const analysisResult = analyzePrompt(input);
      setResult(analysisResult);
      setIsAnalyzing(false);
    }, 50);
  }, [prompt]);

  const clear = useCallback(() => {
    setPrompt('');
    setResult(null);
  }, []);

  const loadExample = useCallback((examplePrompt: string) => {
    setPrompt(examplePrompt);
    setResult(null);
  }, []);

  return {
    prompt,
    setPrompt,
    result,
    isAnalyzing,
    analyze,
    clear,
    loadExample,
  };
}
