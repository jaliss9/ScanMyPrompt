'use client';

import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { TRANSLATIONS } from '@/config/i18n';
import { GlassCard } from '@/components/ui/GlassCard';

interface ImprovedPromptProps {
  original: string;
  improved: string;
}

export function ImprovedPrompt({ original, improved }: ImprovedPromptProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(improved);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Don't show if nothing was improved
  if (original === improved) return null;

  return (
    <GlassCard className="border-cyan-500/20 bg-gradient-to-br from-cyan-900/10 to-transparent">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-cyan-500" />
          <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">
            {t(TRANSLATIONS.quality.improvedPrompt)}
          </h3>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs font-medium text-cyan-400 hover:bg-cyan-500/20 transition-colors"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {t(TRANSLATIONS.security.copied)}
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              {t(TRANSLATIONS.quality.copyImproved)}
            </>
          )}
        </button>
      </div>

      <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-xl p-5 text-sm text-cyan-100/90 whitespace-pre-wrap break-words max-h-64 overflow-y-auto leading-7 shadow-inner relative">
        <div className="absolute top-3 right-3 opacity-20">
          <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        {improved}
      </div>
    </GlassCard>
  );
}
