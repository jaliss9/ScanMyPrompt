'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { TRANSLATIONS } from '@/config/i18n';
import type { DimensionScore } from '@/types';

interface QualityRadarProps {
  dimensions: DimensionScore[];
}

export function QualityRadar({ dimensions }: QualityRadarProps) {
  const { t } = useLanguage();

  const center = 150;
  const maxRadius = 100;
  const numDimensions = dimensions.length;

  // Calculate points for the radar
  // Dimensions are 0-5, we normalize to 0-1 for radius calc
  const getPoint = (index: number, value: number) => {
    const angle = (Math.PI * 2 * index) / numDimensions - Math.PI / 2;
    const normalizedValue = value / 5; // Normalize 0-5 score to 0-1 radius
    const radius = normalizedValue * maxRadius;
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  // Background grid rings (representing 1, 2, 3, 4, 5 scores)
  const rings = [1, 2, 3, 4, 5];

  // Data points
  const points = dimensions.map((d, i) => getPoint(i, d.score));
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  // Label positions (slightly outside the chart)
  // We use a fixed radius for labels to keep them aligned
  const getLabelPoint = (index: number) => {
    const angle = (Math.PI * 2 * index) / numDimensions - Math.PI / 2;
    const radius = maxRadius + 25; // Offset from max radius
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    };
  };

  return (
    <div className="flex justify-center relative py-4">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-violet-600/5 blur-3xl rounded-full" />

      <svg viewBox="0 0 300 300" className="w-full max-w-sm relative z-10 overflow-visible">
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.1" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grid rings */}
        {rings.map((ringValue) => {
          // Normalize ring value (1-5) to radius ratio (0.2 - 1.0)
          const radiusRatio = ringValue; // getPoint expects 0-5 value
          const ringPoints = dimensions.map((_, i) => getPoint(i, radiusRatio));
          const ringPath = ringPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
          return (
            <path
              key={ringValue}
              d={ringPath}
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Axis lines */}
        {dimensions.map((_, i) => {
          const point = getPoint(i, 5); // Max value point
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={point.x}
              y2={point.y}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Area */}
        <path
          d={pathData}
          fill="url(#radarGradient)"
          stroke="#A78BFA"
          strokeWidth="2"
          strokeLinejoin="round"
          filter="url(#glow)"
          className="transition-all duration-1000 ease-out"
        />

        {/* Data Points */}
        {points.map((p, i) => (
          <g key={i} className="group">
            <circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill="#06B6D4"
              stroke="#FFF"
              strokeWidth="1.5"
              className="transition-all duration-300 group-hover:r-6"
            />
            {/* Tooltip on hover (simple SVGs approach, better handled by HTML overlay but this works for simple effect) */}
            <title>{dimensions[i].score}/5</title>
          </g>
        ))}

        {/* Labels */}
        {dimensions.map((dim, i) => {
          const p = getLabelPoint(i);
          const dimKey = dim.dimension as keyof typeof TRANSLATIONS.dimensions;
          return (
            <text
              key={i}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-slate-400 text-[10px] uppercase font-bold tracking-wider"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
            >
              {t(TRANSLATIONS.dimensions[dimKey].name)}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
