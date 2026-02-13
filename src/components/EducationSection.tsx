'use client';

import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { TRANSLATIONS } from '@/config/i18n';
import { ShieldAlertIcon, CheckCircleIcon, ChevronDownIcon } from '@/components/ui/Icons';
import type { SecurityCategory, QualityDimension } from '@/types';

function ExpandableCard({
  title,
  shortDescription,
  children,
  icon,
  iconBgClass
}: {
  title: string;
  shortDescription?: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  iconBgClass: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen(!open)}
      className="group relative bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] text-left overflow-hidden w-full"
    >
      {/* Card Content */}
      <div className="p-6">
        {/* Icon + Title */}
        <div className="flex items-start gap-4 mb-3">
          <div className={`flex-shrink-0 p-3 rounded-xl group-hover:scale-110 transition-transform ${iconBgClass}`}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
          </div>
          <ChevronDownIcon
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${open ? 'rotate-180' : ''
              }`}
          />
        </div>

        {/* Description (always visible) */}
        {shortDescription && !open && (
          <p className="text-sm text-gray-600 leading-relaxed mb-4 animate-fade-in line-clamp-2">
            {shortDescription}
          </p>
        )}

        {/* Expandable Details */}
        {open && (
          <div className="pt-4 border-t border-blue-100/50 animate-slide-down">
            <div className="space-y-3 text-sm text-gray-700">
              {children}
            </div>
          </div>
        )}
      </div>

      {/* Hover gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-500 pointer-events-none rounded-2xl" />
    </button>
  );
}

export function EducationSection() {
  const { t } = useLanguage();

  const attackCategories: SecurityCategory[] = [
    'system_prompt_override',
    'jailbreak',
    'data_exfiltration',
    'tool_agent_abuse',
    'encoding_obfuscation',
    'social_engineering',
  ];

  const qualityDimensions: QualityDimension[] = [
    'context',
    'specificity',
    'structure',
    'constraints',
    'clarity',
    'examples',
  ];

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="mb-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
          {t(TRANSLATIONS.education.title)}
        </h2>
        <p className="text-gray-600">
          Master the art of secure and effective prompt engineering
        </p>
      </div>

      <div className="space-y-16">
        {/* Attacks section */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200"></div>
            <h3 className="text-lg font-bold text-red-500 uppercase tracking-widest flex items-center gap-2">
              <ShieldAlertIcon className="w-5 h-5" />
              {t(TRANSLATIONS.education.attacks.title)}
            </h3>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attackCategories.map((cat) => {
              const info = TRANSLATIONS.education.attacks[cat];
              return (
                <ExpandableCard
                  key={cat}
                  title={t(info.title)}
                  shortDescription={t(info.definition)}
                  icon={<ShieldAlertIcon className="w-6 h-6 text-red-600" />}
                  iconBgClass="bg-gradient-to-br from-red-50 to-red-100/50"
                >
                  <div>
                    <span className="font-medium text-gray-900 block mb-1">Definition:</span>
                    <p className="text-gray-600 leading-relaxed">{t(info.definition)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 block mb-1">Example:</span>
                    <code className="block p-3 bg-red-50 text-red-600 rounded-lg font-mono text-xs border border-red-100">
                      {t(info.example)}
                    </code>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 block mb-1">Defense:</span>
                    <p className="text-green-600 font-medium bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                      {t(info.defense)}
                    </p>
                  </div>
                </ExpandableCard>
              );
            })}
          </div>
        </section>

        {/* Best Practices section */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200"></div>
            <h3 className="text-lg font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
              <CheckCircleIcon className="w-5 h-5" />
              {t(TRANSLATIONS.education.bestPractices.title)}
            </h3>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {qualityDimensions.map((dim) => {
              const info = TRANSLATIONS.education.bestPractices[dim];
              return (
                <ExpandableCard
                  key={dim}
                  title={t(info.title)}
                  shortDescription={t(info.why)}
                  icon={<CheckCircleIcon className="w-6 h-6 text-emerald-600" />}
                  iconBgClass="bg-gradient-to-br from-emerald-50 to-emerald-100/50"
                >
                  <div>
                    <span className="font-medium text-gray-900 block mb-1">Why it matters:</span>
                    <p className="text-gray-600 leading-relaxed">{t(info.why)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 block mb-1">How to apply:</span>
                    <p className="text-gray-600 leading-relaxed">{t(info.how)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 block mb-1">Example:</span>
                    <code className="block p-3 bg-emerald-50 text-emerald-600 rounded-lg font-mono text-xs border border-emerald-100">
                      {t(info.example)}
                    </code>
                  </div>
                </ExpandableCard>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
