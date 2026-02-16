'use client';

import { useState, useMemo } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { TRANSLATIONS } from '@/config/i18n';
import { TabBar } from '@/components/ui/TabBar';
import { CategoryBreakdown } from '@/components/security/CategoryBreakdown';
import { HighlightedPrompt } from '@/components/security/HighlightedPrompt';
import { SafeRewrite } from '@/components/security/SafeRewrite';
import { QualityRadar } from '@/components/quality/QualityRadar';
import { Suggestions } from '@/components/quality/Suggestions';
import type { AnalysisResult } from '@/types';

function SecurityContent({ result }: { result: AnalysisResult }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <CategoryBreakdown categories={result.security.categories} />
      <HighlightedPrompt
        prompt={result.prompt}
        ranges={result.security.highlightRanges}
      />
      {result.security.detections.length > 0 && (
        <SafeRewrite
          original={result.prompt}
          sanitized={result.security.safeVersion}
        />
      )}
    </div>
  );
}

function QualityContent({ result }: { result: AnalysisResult }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Quality Radar & Dimensions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radar Chart Container */}
        <div className="flex items-center justify-center bg-gray-800 border border-gray-700 rounded-2xl shadow-sm p-6">
          <QualityRadar dimensions={result.quality.dimensions} />
        </div>

        {/* Dimension Cards */}
        <div className="space-y-4">
          {result.quality.dimensions.map((dim, idx) => {
            const dimKey = dim.dimension as keyof typeof TRANSLATIONS.dimensions;
            return (
              <div
                key={dim.dimension}
                className="p-4 bg-gray-800 border border-gray-700 rounded-xl shadow-sm transition-all hover:bg-gray-700 hover:border-gray-600"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-white tracking-wide">
                    {t(TRANSLATIONS.dimensions[dimKey].name)}
                  </span>
                  <span className="text-xs font-bold text-gray-400 bg-gray-900 px-2 py-0.5 rounded-full border border-gray-700">
                    {Math.round(dim.score * 100)}%
                  </span>
                </div>

                <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
                  <div
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${dim.score * 100}%`,
                      backgroundColor:
                        dim.score >= 0.7 ? '#10B981' :
                          dim.score >= 0.4 ? '#F59E0B' : '#EF4444'
                    }}
                  />
                </div>

                {dim.findings.length > 0 && (
                  <p className="text-xs text-gray-400 leading-relaxed pl-2 border-l-2 border-gray-600">
                    {t(dim.findings[0])}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Suggestions suggestions={result.quality.suggestions} />
    </div>
  );
}

interface ResultsTabsProps {
  result: AnalysisResult;
}

export function ResultsTabs({ result }: ResultsTabsProps) {
  const { t } = useLanguage();
  const defaultTab = useMemo(
    () => (result.security.riskScore >= 3 ? 'security' : 'quality'),
    [result.security.riskScore]
  );
  const [activeTab, setActiveTab] = useState(defaultTab);

  const resultKey = result.timestamp;

  const tabs = [
    { id: 'security', label: t(TRANSLATIONS.tabs.security) },
    { id: 'quality', label: t(TRANSLATIONS.tabs.quality) },
  ];

  return (
    <div key={resultKey} className="space-y-8 pb-20">
      {/* Tab Bar */}
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'security' && <SecurityContent result={result} />}
        {activeTab === 'quality' && <QualityContent result={result} />}
      </div>
    </div>
  );
}
