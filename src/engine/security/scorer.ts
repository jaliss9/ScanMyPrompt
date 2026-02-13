import type { Detection } from '@/types';

export function calculateRiskScore(detections: Detection[]): 1 | 2 | 3 | 4 | 5 {
  if (detections.length === 0) return 1;

  const maxSeverity = Math.max(...detections.map((d) => d.severity));
  const uniqueCategories = new Set(detections.map((d) => d.category)).size;
  const totalDetections = detections.length;

  let score = 1;

  if (maxSeverity >= 0.8) score = 4;
  else if (maxSeverity >= 0.6) score = 3;
  else if (maxSeverity >= 0.4) score = 2;
  else score = 1;

  if (totalDetections >= 3) score = Math.min(5, score + 1);

  if (uniqueCategories >= 3) score = Math.min(5, score + 1);
  else if (uniqueCategories >= 2) score = Math.min(5, score + 0.5);

  return Math.max(1, Math.min(5, Math.round(score))) as 1 | 2 | 3 | 4 | 5;
}

export const RISK_LABELS = {
  1: { en: 'Safe', fr: 'Sûr' },
  2: { en: 'Low Risk', fr: 'Risque faible' },
  3: { en: 'Medium Risk', fr: 'Risque moyen' },
  4: { en: 'High Risk', fr: 'Risque élevé' },
  5: { en: 'Critical Risk', fr: 'Risque critique' },
} as const;
