'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { TRANSLATIONS } from '@/config/i18n';
import { GlassCard } from '@/components/ui/GlassCard';
import type { HighlightRange, SecurityCategory } from '@/types';

interface HighlightedPromptProps {
  prompt: string;
  ranges: HighlightRange[];
}

const CATEGORY_COLORS: Record<SecurityCategory, string> = {
  system_prompt_override: 'bg-red-500/30 border-red-500/60 text-red-100 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
  jailbreak: 'bg-orange-500/30 border-orange-500/60 text-orange-100 shadow-[0_0_10px_rgba(249,115,22,0.2)]',
  data_exfiltration: 'bg-yellow-500/30 border-yellow-500/60 text-yellow-100 shadow-[0_0_10px_rgba(234,179,8,0.2)]',
  tool_agent_abuse: 'bg-purple-500/30 border-purple-500/60 text-purple-100 shadow-[0_0_10px_rgba(168,85,247,0.2)]',
  encoding_obfuscation: 'bg-cyan-500/30 border-cyan-500/60 text-cyan-100 shadow-[0_0_10px_rgba(6,182,212,0.2)]',
  social_engineering: 'bg-pink-500/30 border-pink-500/60 text-pink-100 shadow-[0_0_10px_rgba(236,72,153,0.2)]',
};

const CATEGORY_DOT_COLORS: Record<SecurityCategory, string> = {
  system_prompt_override: 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.6)]',
  jailbreak: 'bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.6)]',
  data_exfiltration: 'bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.6)]',
  tool_agent_abuse: 'bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.6)]',
  encoding_obfuscation: 'bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.6)]',
  social_engineering: 'bg-pink-500 shadow-[0_0_5px_rgba(236,72,153,0.6)]',
};

export function HighlightedPrompt({ prompt, ranges }: HighlightedPromptProps) {
  const { t } = useLanguage();

  if (ranges.length === 0) return null;

  // Build segments
  const segments: { text: string; range?: HighlightRange }[] = [];
  let lastEnd = 0;

  for (const range of ranges) {
    if (range.start > lastEnd) {
      segments.push({ text: prompt.slice(lastEnd, range.start) });
    }
    segments.push({
      text: prompt.slice(range.start, range.end),
      range,
    });
    lastEnd = range.end;
  }

  if (lastEnd < prompt.length) {
    segments.push({ text: prompt.slice(lastEnd) });
  }

  // Collect unique categories used
  const usedCategories = [...new Set(ranges.map((r) => r.category))];

  return (
    <GlassCard className="border-red-500/20 bg-gradient-to-br from-red-900/10 to-transparent">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-5 rounded-full bg-red-500" />
        <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase">
          {t(TRANSLATIONS.security.highlightedPrompt)}
        </h3>
      </div>

      <div className="bg-[#050510] border border-white/5 rounded-xl p-5 text-sm leading-7 font-mono relative overflow-hidden">
        {/* Scan line animation overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-[10px] w-full animate-[scan_3s_linear_infinite] pointer-events-none opacity-20" />

        {segments.map((seg, i) =>
          seg.range ? (
            <mark
              key={i}
              className={`${CATEGORY_COLORS[seg.range.category]} border rounded px-1 py-0.5 mx-0.5 font-bold transition-transform hover:scale-105 inline-block cursor-help`}
              title={t(TRANSLATIONS.categories[seg.range.category].name)}
            >
              {seg.text}
            </mark>
          ) : (
            <span key={i} className="text-slate-400/90">{seg.text}</span>
          )
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-x-6 gap-y-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t(TRANSLATIONS.security.legend)}:</span>
        {usedCategories.map((cat) => (
          <div key={cat} className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-md border border-white/5">
            <span className={`w-2 h-2 rounded-full ${CATEGORY_DOT_COLORS[cat]}`} />
            <span className="text-xs text-slate-300 font-medium">
              {t(TRANSLATIONS.categories[cat].name)}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
