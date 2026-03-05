'use client';

import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { TRANSLATIONS } from '@/config/i18n';
import { SparklesIcon } from '@/components/ui/Icons';
import { useToast } from '@/components/Toast';
import { sanitizeAiInsightsText, extractImprovedPromptFromInsights } from '@/utils/aiInsights';
import { copyTextToClipboard } from '@/utils/clipboard';

interface AIInsightsProps {
  insights: string | null;
  isLoading: boolean;
  onCopyImproved?: () => void;
  onToggleDetails?: () => void;
  onRetry?: () => void;
  showDetails?: boolean;
  detailsPanelId?: string;
  showUnavailable?: boolean;
}

function ImprovedPromptBlock({ text }: { text: string }) {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  const improved = extractImprovedPromptFromInsights(text);
  if (!improved) return null;

  const handleCopy = async () => {
    await copyTextToClipboard(improved);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    showToast(t(TRANSLATIONS.security.copied));
  };

  return (
    <div className="mb-5 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-bold text-cyan-200">
          {t(TRANSLATIONS.quality.improvedPrompt)}
        </h4>
        <button
          type="button"
          onClick={handleCopy}
          className={`
            inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition-all duration-300
            ${copied
              ? 'text-emerald-300 border border-emerald-500/40 bg-emerald-500/15 scale-105'
              : 'text-cyan-300 hover:text-cyan-200 border border-cyan-500/25 bg-cyan-500/10 hover:bg-cyan-500/20'
            }
          `}
        >
          {copied && (
            <svg className="w-3.5 h-3.5 animate-fade-in" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
          {copied ? t(TRANSLATIONS.security.copied) : t(TRANSLATIONS.quality.copyImproved)}
        </button>
      </div>
      <p className="text-[15px] text-gray-200 leading-7 whitespace-pre-wrap">{improved}</p>
    </div>
  );
}

const IMPROVED_HEADING_PATTERN = /^(#{2,4}\s*)?(version améliorée du prompt|improved prompt version)\s*$/i;

function MarkdownRenderer({ text }: { text: string }) {
  // Simple markdown → HTML: bold, bullets, code blocks, headings
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let skipImprovedSection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect the "Improved prompt version" heading — skip it and everything after,
    // it will be rendered by ImprovedPromptBlock instead.
    if (!inCodeBlock && IMPROVED_HEADING_PATTERN.test(line.trim())) {
      skipImprovedSection = true;
      continue;
    }
    if (skipImprovedSection) continue;

    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={`code-${i}`} className="bg-black/40 text-gray-300 rounded-lg p-4 text-sm font-mono overflow-x-auto my-3 border border-gray-700">
            {codeLines.join('\n')}
          </pre>
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (line.trim() === '') {
      elements.push(<div key={`space-${i}`} className="h-2" />);
      continue;
    }

    // Heading
    if (line.startsWith('### ')) {
      if (elements.length > 0) {
        elements.push(<div key={`sep-${i}`} className="my-3 border-t border-white/10" />);
      }
      elements.push(
        <h4 key={i} className="text-sm font-bold text-white mt-3 mb-2">
          {line.slice(4)}
        </h4>
      );
      continue;
    }
    if (line.startsWith('## ')) {
      elements.push(
        <h3 key={i} className="text-base font-bold text-white mt-4 mb-2">
          {line.slice(3)}
        </h3>
      );
      continue;
    }

    // Bullet
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const content = line.slice(2);
      elements.push(
        <div key={i} className="flex gap-2 ml-1 my-1.5">
          <span className="text-blue-400 mt-0.5 flex-shrink-0">-</span>
          <span className="text-[15px] text-gray-300 leading-7">
            {renderInline(content)}
          </span>
        </div>
      );
      continue;
    }

    // Regular paragraph
    elements.push(
      <p key={i} className="text-[15px] text-gray-300 leading-7 my-1.5">
        {renderInline(line)}
      </p>
    );
  }

  return (
    <>
      <ImprovedPromptBlock text={text} />
      {elements}
    </>
  );
}

function renderInline(text: string) {
  const nodes: React.ReactNode[] = [];
  const tokenPattern = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = tokenPattern.exec(text)) !== null) {
    const start = match.index;
    const token = match[0];

    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }

    if (token.startsWith('**') && token.endsWith('**')) {
      const content = token.slice(2, -2);
      nodes.push(
        <strong key={`b-${key++}`} className="font-semibold text-white">
          {content}
        </strong>
      );
    } else if (token.startsWith('`') && token.endsWith('`')) {
      const content = token.slice(1, -1);
      nodes.push(
        <code key={`c-${key++}`} className="bg-gray-800 text-gray-300 px-1.5 py-0.5 rounded text-xs font-mono border border-gray-700">
          {content}
        </code>
      );
    }

    lastIndex = start + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function LoadingSkeleton() {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        <span>{t(TRANSLATIONS.ai.loading)}</span>
      </div>
      <div className="space-y-3 animate-pulse">
        <div className="h-3 bg-gray-700 rounded-full w-3/4" />
        <div className="h-3 bg-gray-700 rounded-full w-full" />
        <div className="h-3 bg-gray-700 rounded-full w-5/6" />
        <div className="h-3 bg-gray-700 rounded-full w-2/3" />
      </div>
    </div>
  );
}

export function AIInsights({
  insights,
  isLoading,
  onCopyImproved,
  onToggleDetails,
  onRetry,
  showDetails = false,
  detailsPanelId,
  showUnavailable = false,
}: AIInsightsProps) {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [copiedInsights, setCopiedInsights] = useState(false);

  if (!isLoading && !insights && !showUnavailable) return null;
  const safeInsights = insights ? sanitizeAiInsightsText(insights) : '';

  const handleCopyInsights = async () => {
    if (!safeInsights) return;
    await copyTextToClipboard(safeInsights);
    setCopiedInsights(true);
    setTimeout(() => setCopiedInsights(false), 1500);
    showToast(t(TRANSLATIONS.security.copied));
  };

  return (
    <div className="bg-[#111111] rounded-2xl border border-[#222] shadow-sm overflow-hidden animate-fade-in">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400" />

      <div className="p-5 sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-900/30 to-violet-900/30 rounded-lg">
              <SparklesIcon className="w-5 h-5 text-violet-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">
              {t(TRANSLATIONS.ai.title)}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {!isLoading && safeInsights && (
              <button
                type="button"
                onClick={handleCopyInsights}
                className={`
                  inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition-all duration-300
                  ${copiedInsights
                    ? 'text-emerald-300 border border-emerald-500/40 bg-emerald-500/15 scale-105'
                    : 'text-slate-300 hover:text-white border border-white/10 bg-white/[0.03] hover:bg-white/[0.08]'
                  }
                `}
              >
                {copiedInsights && (
                  <svg className="w-3.5 h-3.5 animate-fade-in" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {copiedInsights ? t(TRANSLATIONS.security.copied) : t(TRANSLATIONS.ai.copyAnalysis)}
              </button>
            )}
            {onToggleDetails && (
              <button
                type="button"
                onClick={onToggleDetails}
                aria-expanded={showDetails}
                aria-controls={detailsPanelId}
                className="px-2.5 py-1 text-xs text-slate-300 hover:text-white border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] rounded-md transition-colors"
              >
                {showDetails ? t(TRANSLATIONS.verdict.hideDetails) : t(TRANSLATIONS.verdict.seeDetails)}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : safeInsights ? (
          <div className="animate-fade-in">
            <MarkdownRenderer text={safeInsights} />
          </div>
        ) : showUnavailable ? (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <p className="text-sm font-medium text-amber-200">{t(TRANSLATIONS.ai.error)}</p>
            <p className="mt-1 text-xs text-amber-100/80">{t(TRANSLATIONS.ai.fallback)}</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="mt-3 px-3 py-1.5 text-xs font-medium text-amber-200 border border-amber-500/30 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 transition-colors"
              >
                {t(TRANSLATIONS.ai.retry)}
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
