'use client';

import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { TRANSLATIONS } from '@/config/i18n';
import { SparklesIcon } from '@/components/ui/Icons';
import { useToast } from '@/components/Toast';
import { sanitizeAiInsightsText } from '@/utils/aiInsights';
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

function MarkdownRenderer({ text }: { text: string }) {
  // Simple markdown → HTML: bold, bullets, code blocks, headings
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

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

  return <>{elements}</>;
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
    const copied = await copyTextToClipboard(safeInsights);
    if (copied) {
      setCopiedInsights(true);
      setTimeout(() => setCopiedInsights(false), 1500);
      showToast(t(TRANSLATIONS.security.copied));
    }
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
                className="px-2.5 py-1 text-xs text-slate-300 hover:text-white border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] rounded-md transition-colors"
              >
                {copiedInsights ? t(TRANSLATIONS.security.copied) : t(TRANSLATIONS.ai.copyAnalysis)}
              </button>
            )}
            {onCopyImproved && (
              <button
                type="button"
                onClick={onCopyImproved}
                className="px-2.5 py-1 text-xs text-cyan-300 hover:text-cyan-200 border border-cyan-500/25 bg-cyan-500/10 hover:bg-cyan-500/20 rounded-md transition-colors"
              >
                {t(TRANSLATIONS.quality.copyImproved)}
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
