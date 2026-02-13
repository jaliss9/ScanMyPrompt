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

export function ExampleLibrary({ onLoadExample, onAnalyze }: ExampleLibraryProps) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<FilterTag>('all');

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

  const handleTry = (prompt: string) => {
    onLoadExample(prompt);
    onAnalyze(prompt);
  };

  const getRiskColor = (risk: number) => {
    const colors: Record<number, string> = {
      1: 'bg-emerald-100 text-emerald-700',
      2: 'bg-green-100 text-green-700',
      3: 'bg-yellow-100 text-yellow-700',
      4: 'bg-orange-100 text-orange-700',
      5: 'bg-red-100 text-red-700'
    };
    return colors[risk] || colors[5];
  };

  const getQualityColor = (quality: number) => {
    const colors: Record<number, string> = {
      1: 'bg-red-100 text-red-700',
      2: 'bg-orange-100 text-orange-700',
      3: 'bg-yellow-100 text-yellow-700',
      4: 'bg-green-100 text-green-700',
      5: 'bg-emerald-100 text-emerald-700'
    };
    return colors[quality] || colors[1];
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
          {t(TRANSLATIONS.examples.title)}
        </h2>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mr-4 pr-4 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap ${filter === f.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50 border border-gray-200'
                }`}
            >
              {t(f.label)}
            </button>
          ))}
        </div>
      </div>

      {/* Examples grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {filteredExamples.map((ex, index) => (
          <div
            key={index}
            className="group relative bg-gradient-to-br from-white/90 to-blue-50/50 backdrop-blur-lg border border-blue-100/50 rounded-2xl shadow-lg shadow-blue-100/20 hover:shadow-xl hover:shadow-blue-200/30 transition-all duration-300 hover:scale-[1.02] overflow-hidden flex flex-col"
          >
            {/* Top badge section with Risk/Quality */}
            <div className="flex items-center justify-between p-6 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-red-50 to-red-100/50 rounded-lg">
                  <AlertTriangleIcon className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 block">Risk</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getRiskColor(ex.expectedRisk)}`}>
                    {ex.expectedRisk}/5
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-lg">
                  <SparklesIcon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 block">Quality</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getQualityColor(ex.expectedQuality)}`}>
                    {ex.expectedQuality}/5
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="px-6 pb-4 flex-1">
              <p className="text-sm font-medium text-gray-900 mb-2 truncate">
                {t(ex.label)}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                {ex.prompt}
              </p>
            </div>

            {/* CTA Button */}
            <div className="px-6 pb-6 mt-auto">
              <button
                onClick={() => handleTry(ex.prompt)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/80 hover:bg-white border border-blue-200/50 rounded-xl text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors group-hover:border-blue-300 cursor-pointer"
              >
                {t(TRANSLATIONS.examples.tryThis)}
                <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-500 pointer-events-none rounded-2xl" />
          </div>
        ))}
      </div>
    </div>
  );
}
