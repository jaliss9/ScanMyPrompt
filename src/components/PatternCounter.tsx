'use client';

import { ANALYSIS_METRICS } from '@/engine/metrics';

interface PatternCounterProps {
    issuesFound: number;
}

export function PatternCounter({ issuesFound }: PatternCounterProps) {
    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6 animate-fade-in">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-md shadow-blue-500/20">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900 text-sm">
                            {ANALYSIS_METRICS.securityPatterns} Security Patterns Verified
                        </p>
                        <p className="text-xs text-gray-500">
                            {ANALYSIS_METRICS.securityCategories} OWASP categories analyzed
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    <p className={`text-2xl font-bold ${issuesFound > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                        {issuesFound}
                    </p>
                    <p className="text-xs text-gray-500">
                        {issuesFound === 0 ? 'No issues' : issuesFound === 1 ? 'Issue found' : 'Issues found'}
                    </p>
                </div>
            </div>
        </div>
    );
}
