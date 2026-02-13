import type { DimensionScore, QualityDimension } from '@/types';

const WEIGHTS: Record<QualityDimension, number> = {
  context: 0.20,
  specificity: 0.20,
  clarity: 0.25,
  structure: 0.10,
  constraints: 0.15,
  examples: 0.10,
};

export function calculateQualityScore(dimensions: DimensionScore[]): 1 | 2 | 3 | 4 | 5 {
  const weighted = dimensions.reduce(
    (sum, d) => sum + d.score * WEIGHTS[d.dimension],
    0
  );

  if (weighted >= 0.8) return 5;
  if (weighted >= 0.6) return 4;
  if (weighted >= 0.4) return 3;
  if (weighted >= 0.2) return 2;
  return 1;
}

export const QUALITY_LABELS = {
  1: { en: 'Poor', fr: 'Faible' },
  2: { en: 'Weak', fr: 'Insuffisant' },
  3: { en: 'Average', fr: 'Moyen' },
  4: { en: 'Good', fr: 'Bon' },
  5: { en: 'Excellent', fr: 'Excellent' },
} as const;
