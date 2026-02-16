'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { TRANSLATIONS } from '@/config/i18n';
import { GlassCard } from '@/components/ui/GlassCard';
import { EMPTY_SAFE_VERSION } from '@/engine/security/sanitizer';
import { useToast } from '@/components/Toast';
import { copyTextToClipboard } from '@/utils/clipboard';

interface SafeRewriteProps {
  original: string;
  sanitized: string;
}

export function SafeRewrite({ original, sanitized }: SafeRewriteProps) {
  const { t } = useLanguage();
  const { showToast } = useToast();

  const isEmpty = !sanitized;

  const handleCopy = async () => {
    const copied = await copyTextToClipboard(sanitized);
    if (copied) {
      showToast(t(TRANSLATIONS.security.copied));
    }
  };

  return (
    <GlassCard className="border-emerald-500/20 bg-gradient-to-br from-emerald-900/10 to-transparent">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-emerald-500" />
          <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">
            {t(TRANSLATIONS.security.safeRewrite)}
          </h3>
        </div>

        {!isEmpty && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            {t(TRANSLATIONS.security.copyClean)}
          </button>
        )}
      </div>

      {isEmpty ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3">
          <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm text-red-300 font-medium">
            {t(EMPTY_SAFE_VERSION)}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
              {t(TRANSLATIONS.security.original)}
            </p>
            <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 text-sm text-slate-400 whitespace-pre-wrap break-words max-h-60 overflow-y-auto font-mono leading-relaxed">
              {original}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-bold text-emerald-500/80 uppercase tracking-widest pl-1">
              {t(TRANSLATIONS.security.sanitized)}
            </p>
            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 text-sm text-emerald-100 whitespace-pre-wrap break-words max-h-60 overflow-y-auto font-mono leading-relaxed shadow-inner">
              {sanitized}
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
