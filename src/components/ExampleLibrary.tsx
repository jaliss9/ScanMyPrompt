'use client';

import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { TRANSLATIONS } from '@/config/i18n';
import { EXAMPLES } from '@/config/examples';
import { AlertTriangleIcon, SparklesIcon, ArrowRightIcon } from '@/components/ui/Icons';

interface ExampleLibraryProps {
  onLoadExample: (prompt: string) => void;
  onAnalyze: (prompt: string) => void;
}

type FilterTag = 'all' | 'security' | 'quality' | 'safe' | 'malicious';

const INITIAL_VISIBLE = 6;

export function ExampleLibrary({ onLoadExample, onAnalyze }: ExampleLibraryProps) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<FilterTag>('all');
  const [expanded, setExpanded] = useState(false);

  const filters: { id: FilterTag; label: { en: string; fr: string } }[] = [
    { id: 'all', label: TRANSLATIONS.examples.filters.all },
    { id: 'security', label: TRANSLATIONS.examples.filters.security },
    { id: 'quality', label: TRANSLATIONS.examples.filters.quality },
    { id: 'safe', label: TRANSLATIONS.examples.filters.safe },
    { id: 'malicious', label: TRANSLATIONS.examples.filters.malicious },
  ];

  const filteredExamples =
    filter === 'all'
      ? EXAMPLES
      : EXAMPLES.filter((ex) => ex.tags.includes(filter as 'security' | 'quality' | 'safe' | 'malicious'));

  const visibleExamples = expanded ? filteredExamples : filteredExamples.slice(0, INITIAL_VISIBLE);
  const hasMore = filteredExamples.length > INITIAL_VISIBLE;

  const handleTry = (prompt: string) => {
    onLoadExample(prompt);
    onAnalyze(prompt);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-between mb-12">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          {t(TRANSLATIONS.examples.title)}
        </h2>

        {/* Filter chips - dark style */}
        <div className="flex flex-wrap justify-center gap-3">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${filter === f.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700 hover:border-gray-600'
                }`}
            >
              {t(f.label)}
            </button>
          ))}
        </div>
      </div>

      {/* Examples grid - Dark Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {visibleExamples.map((ex, index) => (
          <div
            key={index}
            className="group bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:bg-gray-700 hover:border-gray-600 transition-all flex flex-col"
          >
            {/* Badges */}
            <div className="flex items-center gap-3 mb-4">
              {/* Risk badge */}
              <div className="flex items-center gap-2">
                <AlertTriangleIcon className="w-4 h-4 text-red-400" />
                <span className="text-xs text-red-400 font-medium">{t(TRANSLATIONS.examples.risk)}: {ex.expectedRisk}/5</span>
              </div>

              {/* Quality badge */}
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-4 h-4 text-yellow-400" />
                <span className="text-xs text-yellow-400 font-medium">{t(TRANSLATIONS.examples.qualityLabel)}: {ex.expectedQuality}/5</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-white mb-2 truncate">
              {t(ex.label)}
            </h3>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed line-clamp-3 flex-1">
              {ex.prompt}
            </p>

            <button
              onClick={() => handleTry(ex.prompt)}
              className="text-sm text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 mt-auto self-start group/btn"
            >
              {t(TRANSLATIONS.examples.tryThis)}
              <ArrowRightIcon className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
            </button>
          </div>
        ))}
      </div>

      {/* Show more button */}
      {(hasMore || expanded) && (
        <div className="text-center mt-12">
          <button
            onClick={() => {
              setExpanded((v) => !v);
              if (expanded) setFilter('all');
            }}
            className="px-6 py-2.5 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full transition-colors"
          >
            {expanded ? t(TRANSLATIONS.examples.showLess) : t(TRANSLATIONS.examples.showMore)}
          </button>
        </div>
      )}
    </div>
  );
}
