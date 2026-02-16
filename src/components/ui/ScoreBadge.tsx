'use client';

interface ScoreBadgeProps {
    score: number;
    type: 'risk' | 'quality';
    size?: 'sm' | 'md';
}

const RISK_COLORS: Record<number, string> = {
    1: 'bg-emerald-500 shadow-emerald-500/30',
    2: 'bg-green-500 shadow-green-500/30',
    3: 'bg-yellow-500 shadow-yellow-500/30',
    4: 'bg-orange-500 shadow-orange-500/30',
    5: 'bg-red-500 shadow-red-500/30',
};

const QUALITY_COLORS: Record<number, string> = {
    1: 'bg-red-500 shadow-red-500/30',
    2: 'bg-orange-500 shadow-orange-500/30',
    3: 'bg-yellow-500 shadow-yellow-500/30',
    4: 'bg-green-500 shadow-green-500/30',
    5: 'bg-emerald-500 shadow-emerald-500/30',
};

export function ScoreBadge({ score, type, size = 'md' }: ScoreBadgeProps) {
    const colors = type === 'risk' ? RISK_COLORS : QUALITY_COLORS;
    const bgColor = colors[score] || 'bg-gray-500 shadow-gray-500/30';
    const sizeClasses = size === 'sm' ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-sm';

    return (
        <div
            className={`inline-flex items-center justify-center ${sizeClasses} ${bgColor} rounded-full text-white font-bold shadow-lg transition-transform hover:scale-110`}
        >
            {score}
        </div>
    );
}
