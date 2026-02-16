'use client';

import { useMemo } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { TRANSLATIONS } from '@/config/i18n';
import { ANALYSIS_METRICS } from '@/engine/metrics';

interface ScanningOverlayProps {
    isVisible: boolean;
    progress: number;
}

export function ScanningOverlay({ isVisible, progress }: ScanningOverlayProps) {
    const { t } = useLanguage();
    const scanSteps = [
        t(TRANSLATIONS.scanning.step1),
        t(TRANSLATIONS.scanning.step2),
        t(TRANSLATIONS.scanning.step3),
        t(TRANSLATIONS.scanning.step4),
        t(TRANSLATIONS.scanning.step5),
        t(TRANSLATIONS.scanning.step6),
        t(TRANSLATIONS.scanning.step7),
        t(TRANSLATIONS.scanning.step8),
    ];

    const currentStep = useMemo(() => {
        if (!isVisible) return 0;
        return Math.min(
            Math.floor((progress / 100) * scanSteps.length),
            scanSteps.length - 1
        );
    }, [isVisible, progress, scanSteps.length]);

    if (!isVisible) return null;

    const patternsChecked = Math.min(
        ANALYSIS_METRICS.securityPatterns,
        Math.floor((progress / 100) * ANALYSIS_METRICS.securityPatterns)
    );

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center animate-fade-in">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-blue-500/10 blur-3xl rounded-full pointer-events-none" />

                {/* Animated scanner icon */}
                <div className="flex justify-center mb-6 relative z-10">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 w-16 h-16 border-4 border-gray-700 rounded-full" />
                        <div className="absolute inset-0 w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
                        <svg
                            className="absolute inset-0 m-auto w-7 h-7 text-blue-500 animate-pulse"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Status text */}
                <div className="relative z-10 text-center space-y-2">
                    <h3 className="text-xl font-semibold text-white">
                        {t(TRANSLATIONS.scanning.title)}
                    </h3>
                    <p className="text-sm text-gray-400 min-h-[20px] transition-all duration-300">
                        {scanSteps[currentStep]}
                    </p>
                </div>

                {/* Progress bar */}
                <div className="relative z-10 w-full bg-gray-800 rounded-full h-2 overflow-hidden mt-6 border border-gray-700">
                    <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-200 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Pattern counter */}
                <p className="relative z-10 text-xs text-gray-500 text-center mt-3 font-mono">
                    {patternsChecked} / {ANALYSIS_METRICS.securityPatterns} {t(TRANSLATIONS.scanning.patternsChecked)}
                </p>
            </div>
        </div>
    );
}
