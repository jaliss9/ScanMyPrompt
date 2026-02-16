import { SECURITY_PATTERNS } from './security/patterns';
import type { QualityDimension, SecurityCategory } from '@/types';

const QUALITY_DIMENSIONS: readonly QualityDimension[] = [
  'context',
  'specificity',
  'structure',
  'constraints',
  'clarity',
  'examples',
];

const securityCategorySet = new Set<SecurityCategory>(
  SECURITY_PATTERNS.map((pattern) => pattern.category)
);

export const ANALYSIS_METRICS = Object.freeze({
  securityPatterns: SECURITY_PATTERNS.length,
  securityCategories: securityCategorySet.size,
  qualityDimensions: QUALITY_DIMENSIONS.length,
});

