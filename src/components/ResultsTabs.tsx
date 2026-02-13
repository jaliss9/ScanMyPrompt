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
import { ImprovedPrompt } from '@/components/quality/ImprovedPrompt';
import { GlassCard } from '@/components/ui/GlassCard';
import { ExportButton } from '@/components/ExportButton';
import { ShareButton } from '@/components/ShareButton';
import type { AnalysisResult } from '@/types';

function SecurityContent({ result }: { result: AnalysisResult }) {
  return (
    <div className="space-y-8 animate-fade-in-up">
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
    <div className="space-y-8 animate-fade-in-up">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="flex items-center justify-center bg-white border-gray-100 shadow-sm">
          <QualityRadar dimensions={result.quality.dimensions} />
        </GlassCard>

        <div className="space-y-4">
          {result.quality.dimensions.map((dim, idx) => {
            const dimKey = dim.dimension as keyof typeof TRANSLATIONS.dimensions;
            return (
              <div key={dim.dimension} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm transition-all hover:shadow-md" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700 tracking-wide">
                    {t(TRANSLATIONS.dimensions[dimKey].name)}
                  </span>
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {Math.round(dim.score * 100)}%
                  </span>
                </div>

                <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
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
                  <p className="text-xs text-gray-500 leading-relaxed pl-2 border-l-2 border-gray-200">
                    {t(dim.findings[0])}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Suggestions suggestions={result.quality.suggestions} />
      <ImprovedPrompt
        original={result.prompt}
        improved={result.quality.improvedVersion}
      />
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

  // Reset tab when result changes using key-based approach
  const resultKey = result.timestamp;

  const tabs = [
    { id: 'security', label: t(TRANSLATIONS.tabs.security) },
    { id: 'quality', label: t(TRANSLATIONS.tabs.quality) },
    { id: 'full', label: t(TRANSLATIONS.tabs.fullReport) },
  ];

  return (
    <div key={resultKey} className="space-y-8 pb-20">

      {/* Summary Pills Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm animate-fade-in">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Analysis Complete</h3>
              <p className="text-xs text-gray-500">{new Date(result.timestamp).toLocaleTimeString()}</p>
            </div>
          </div>

          <div className="h-8 w-px bg-gray-200 hidden md:block" />

          <div className="flex gap-4">
            {/* Mini Gauges / Pills */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
              <span className="text-xs font-medium text-gray-500">Risk</span>
              <span className={`text-sm font-bold ${result.security.riskScore > 3 ? 'text-red-500' : 'text-emerald-500'}`}>
                {result.security.riskScore}/5
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
              <span className="text-xs font-medium text-gray-500">Quality</span>
              <span className="text-sm font-bold text-blue-500">
                {Math.round(result.quality.qualityScore * 100)}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ExportButton result={result} />
          <ShareButton result={result} />
        </div>
      </div>

      {/* Tab Bar */}
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'security' && <SecurityContent result={result} />}
        {activeTab === 'quality' && <QualityContent result={result} />}
        {activeTab === 'full' && (
          <div className="space-y-12 animate-fade-in-up">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gray-200" />
                <h2 className="text-lg font-bold text-gray-400 uppercase tracking-widest">
                  {t(TRANSLATIONS.security.title)}
                </h2>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
              <SecurityContent result={result} />
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gray-200" />
                <h2 className="text-lg font-bold text-gray-400 uppercase tracking-widest">
                  {t(TRANSLATIONS.quality.title)}
                </h2>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
              <QualityContent result={result} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
