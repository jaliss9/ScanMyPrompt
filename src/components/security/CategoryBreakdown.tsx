'use client';

import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { TRANSLATIONS } from '@/config/i18n';
import { Badge } from '@/components/ui/Badge';
import type { CategoryScore, SecurityCategory } from '@/types';

// Map categories to OWASP LLM Top 10 references
const OWASP_REFS: Record<SecurityCategory, { id: string; url: string }> = {
  system_prompt_override: { id: 'LLM01', url: 'https://genai.owasp.org/llmrisk/llm01-prompt-injection/' },
  jailbreak: { id: 'LLM01', url: 'https://genai.owasp.org/llmrisk/llm01-prompt-injection/' },
  data_exfiltration: { id: 'LLM06', url: 'https://genai.owasp.org/llmrisk/llm06-excessive-agency/' },
  tool_agent_abuse: { id: 'LLM06', url: 'https://genai.owasp.org/llmrisk/llm06-excessive-agency/' },
  encoding_obfuscation: { id: 'LLM01', url: 'https://genai.owasp.org/llmrisk/llm01-prompt-injection/' },
  social_engineering: { id: 'LLM09', url: 'https://genai.owasp.org/llmrisk/llm09-misinformation/' },
};

interface CategoryBreakdownProps {
  categories: CategoryScore[];
}

const CATEGORY_ICONS: Record<SecurityCategory, string> = {
  system_prompt_override: '🔓',
  jailbreak: '🔥',
  data_exfiltration: '📤',
  tool_agent_abuse: '⚙️',
  encoding_obfuscation: '🔣',
  social_engineering: '🎭',
};

export function CategoryBreakdown({ categories }: CategoryBreakdownProps) {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState<SecurityCategory | null>(null);

  return (
    <div className="glass-panel overflow-hidden rounded-xl">
      {/* Table Header */}
      <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-white/5 bg-white/[0.02] text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
        <div className="col-span-5">{t(TRANSLATIONS.categoryBreakdown.category)}</div>
        <div className="col-span-4">{t(TRANSLATIONS.categoryBreakdown.riskScore)}</div>
        <div className="col-span-3 text-right">{t(TRANSLATIONS.categoryBreakdown.detections)}</div>
      </div>

      <div className="divide-y divide-white/5">
        {categories.map((cat) => {
          const isExpanded = expanded === cat.category;
          const catInfo = TRANSLATIONS.categories[cat.category];
          const hasDetections = cat.detections.length > 0;

          return (
            <div key={cat.category} className="group transition-colors hover:bg-white/[0.02]">
              <div
                className={`grid grid-cols-12 gap-4 px-4 py-3 items-center ${hasDetections ? 'cursor-pointer' : 'opacity-50'}`}
                role={hasDetections ? 'button' : undefined}
                tabIndex={hasDetections ? 0 : -1}
                onClick={() => hasDetections && setExpanded(isExpanded ? null : cat.category)}
                onKeyDown={(e) => {
                  if (hasDetections && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    setExpanded(isExpanded ? null : cat.category);
                  }
                }}
              >
                {/* Category Name & Icon */}
                <div className="col-span-5 flex items-center gap-3">
                  <span className="text-base grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                    {CATEGORY_ICONS[cat.category]}
                  </span>
                  <div>
                    <div className={`text-sm font-medium ${hasDetections ? 'text-slate-200' : 'text-slate-500'}`}>
                      {t(catInfo.name)}
                    </div>
                  </div>
                </div>

                {/* Score Bar */}
                <div className="col-span-4">
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${cat.score * 100}%`,
                        backgroundColor: cat.score === 0 ? 'transparent' :
                          cat.score < 0.4 ? '#84CC16' :
                            cat.score < 0.6 ? '#EAB308' :
                              cat.score < 0.8 ? '#F97316' : '#EF4444'
                      }}
                    />
                  </div>
                </div>

                {/* Detections / Expand */}
                <div className="col-span-3 flex justify-end">
                  {hasDetections ? (
                    <Badge variant="critical" className="font-mono">
                      {cat.detections.length}
                    </Badge>
                  ) : (
                    <span className="text-xs text-slate-600 font-mono">-</span>
                  )}
                </div>
              </div>

              {/* Expanded Details - Dense Table within */}
              {isExpanded && hasDetections && (
                <div className="bg-[#0A0A0A]/50 border-y border-white/5 px-4 py-3 space-y-2">
                  {cat.detections.map((det, i) => {
                    const owaspRef = OWASP_REFS[cat.category];
                    return (
                      <div key={i} className="flex gap-4 p-2 rounded border border-white/5 bg-white/[0.02]">
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-red-400">{t(det.name)}</span>
                            <span className="text-[10px] text-slate-500">{t(TRANSLATIONS.security.severity)}: {Math.round(det.severity * 100)}%</span>
                          </div>
                          <p className="text-xs text-slate-400">{t(det.description)}</p>
                          <div className="mt-1 font-mono text-[10px] text-red-300/80 bg-red-900/10 px-2 py-1 rounded w-fit max-w-full truncate">
                            {det.matchedText}
                          </div>
                          {/* OWASP Reference Link */}
                          {owaspRef && (
                            <a
                              href={owaspRef.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 mt-1.5 text-[10px] text-blue-400 hover:text-blue-300 font-medium transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              OWASP {owaspRef.id}
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
