'use client';

import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { TRANSLATIONS } from '@/config/i18n';
import { GlassCard } from '@/components/ui/GlassCard';

interface BYOKConfigProps {
  prompt: string;
}

export function BYOKConfig({ prompt }: BYOKConfigProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [provider, setProvider] = useState<'openai' | 'anthropic'>('openai');
  const [running, setRunning] = useState(false);
  const [llmResult, setLlmResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    if (!apiKey.trim() || !prompt.trim()) return;

    setRunning(true);
    setError(null);
    setLlmResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, apiKey, provider }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      setLlmResult(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
      >
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        {t(TRANSLATIONS.byok.title)}
      </button>

      {isOpen && (
        <GlassCard className="mt-3 animate-fade-in">
          <p className="text-xs text-slate-500 mb-4">
            {t(TRANSLATIONS.byok.description)}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex-1">
              <label className="text-xs text-slate-400 mb-1 block">
                {t(TRANSLATIONS.byok.apiKey)}
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-violet-500/50"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">
                {t(TRANSLATIONS.byok.provider)}
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as 'openai' | 'anthropic')}
                className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500/50"
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
              </select>
            </div>
          </div>

          <button
            onClick={handleRun}
            disabled={!apiKey.trim() || !prompt.trim() || running}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-cyan-600/30 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
          >
            {running ? t(TRANSLATIONS.byok.running) : t(TRANSLATIONS.byok.runAnalysis)}
          </button>

          {error && (
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
              {error}
            </div>
          )}

          {llmResult && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-slate-300 mb-2">
                {t(TRANSLATIONS.byok.result)}
              </h4>
              <div className="bg-black/30 rounded-lg p-4 text-sm text-slate-300 whitespace-pre-wrap max-h-64 overflow-y-auto">
                {llmResult}
              </div>
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
}
