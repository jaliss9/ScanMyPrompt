'use client';

import { useState } from 'react';
import Link from 'next/link';
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
      className="group relative bg-[#111111] border border-[#222] rounded-2xl p-6 shadow-sm hover:bg-[#151515] hover:border-[#333] transition-all duration-300 text-left overflow-hidden w-full"
    >
      {/* Card Content */}
      <div className="relative z-10">
        {/* Icon + Title */}
        <div className="flex items-start gap-4 mb-3">
          <div className={`flex-shrink-0 p-3 rounded-xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 ${iconBgClass}`}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
              {title}
            </h3>
          </div>
          <ChevronDownIcon
            className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${open ? 'rotate-180' : ''
              }`}
          />
        </div>

        {/* Description (always visible) */}
        {shortDescription && !open && (
          <p className="text-sm text-gray-400 leading-relaxed mb-4 animate-fade-in line-clamp-2">
            {shortDescription}
          </p>
        )}

        {/* Expandable Details */}
        {open && (
          <div className="pt-4 border-t border-[#222] animate-slide-down">
            <div className="space-y-4 text-sm text-gray-300">
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

interface EducationSectionProps {
  showAll?: boolean;
  showHeader?: boolean;
}

const PREVIEW_ATTACKS: SecurityCategory[] = [
  'system_prompt_override',
  'jailbreak',
  'data_exfiltration',
];

const ALL_ATTACKS: SecurityCategory[] = [
  'system_prompt_override',
  'jailbreak',
  'data_exfiltration',
  'tool_agent_abuse',
  'encoding_obfuscation',
  'social_engineering',
];

const ALL_DIMENSIONS: QualityDimension[] = [
  'context',
  'specificity',
  'structure',
  'constraints',
  'clarity',
  'examples',
];

export function EducationSection({ showAll = false, showHeader = true }: EducationSectionProps) {
  const { t } = useLanguage();

  const attackCategories = showAll ? ALL_ATTACKS : PREVIEW_ATTACKS;

  return (
    <div className="max-w-6xl mx-auto px-4">
      {showHeader && (
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
            {t(TRANSLATIONS.education.title)}
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            {t(TRANSLATIONS.education.subtitle)}
          </p>
        </div>
      )}

      <div className="space-y-16">
        {/* Attacks section */}
        <section>
          <div className="mb-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-800"></div>
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest flex items-center gap-2 px-4 py-1 bg-red-400/10 rounded-full border border-red-400/20">
              <ShieldAlertIcon className="w-4 h-4" />
              {t(TRANSLATIONS.education.attacks.title)}
            </h3>
            <div className="h-px flex-1 bg-gray-800"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {attackCategories.map((cat) => {
              const info = TRANSLATIONS.education.attacks[cat];
              return (
                <ExpandableCard
                  key={cat}
                  title={t(info.title)}
                  shortDescription={t(info.definition)}
                  icon={<ShieldAlertIcon className="w-6 h-6 text-white" />}
                  iconBgClass="bg-gradient-to-br from-red-500 to-pink-600 shadow-lg shadow-red-500/20"
                >
                  <div>
                    <span className="font-semibold text-white block mb-1">{t(TRANSLATIONS.education.definition)}</span>
                    <p className="text-gray-400 leading-relaxed">{t(info.definition)}</p>
                  </div>
                  <div>
                    <span className="font-semibold text-white block mb-1">{t(TRANSLATIONS.education.example)}</span>
                    <code className="block p-3 bg-red-950/30 text-red-300 rounded-lg font-mono text-xs border border-red-500/20">
                      {t(info.example)}
                    </code>
                  </div>
                  <div>
                    <span className="font-semibold text-white block mb-1">{t(TRANSLATIONS.education.defense)}</span>
                    <p className="text-green-400 font-medium bg-green-950/30 px-3 py-2 rounded-lg border border-green-500/20">
                      {t(info.defense)}
                    </p>
                  </div>
                </ExpandableCard>
              );
            })}
          </div>

          {!showAll && (
            <div className="text-center mt-12">
              <Link
                href="/about#education"
                className="px-6 py-2.5 text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full transition-colors inline-block"
              >
                {t(TRANSLATIONS.education.learnMore)}
              </Link>
            </div>
          )}
        </section>

        {/* Best Practices section */}
        {showAll && (
          <section>
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-800"></div>
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2 px-4 py-1 bg-emerald-400/10 rounded-full border border-emerald-400/20">
                <CheckCircleIcon className="w-4 h-4" />
                {t(TRANSLATIONS.education.bestPractices.title)}
              </h3>
              <div className="h-px flex-1 bg-gray-800"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ALL_DIMENSIONS.map((dim) => {
                const info = TRANSLATIONS.education.bestPractices[dim];
                return (
                  <ExpandableCard
                    key={dim}
                    title={t(info.title)}
                    shortDescription={t(info.why)}
                    icon={<CheckCircleIcon className="w-6 h-6 text-white" />}
                    iconBgClass="bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20"
                  >
                    <div>
                      <span className="font-semibold text-white block mb-1">{t(TRANSLATIONS.education.whyItMatters)}</span>
                      <p className="text-gray-400 leading-relaxed">{t(info.why)}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-white block mb-1">{t(TRANSLATIONS.education.howToApply)}</span>
                      <p className="text-gray-400 leading-relaxed">{t(info.how)}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-white block mb-1">{t(TRANSLATIONS.education.example)}</span>
                      <code className="block p-3 bg-emerald-950/30 text-emerald-300 rounded-lg font-mono text-xs border border-emerald-500/20">
                        {t(info.example)}
                      </code>
                    </div>
                  </ExpandableCard>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
