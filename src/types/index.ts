export interface Pattern {
  id: string;
  regex: RegExp;
  category: SecurityCategory;
  severity: number;
  name: { en: string; fr: string };
  description: { en: string; fr: string };
}

export type SecurityCategory =
  | 'system_prompt_override'
  | 'jailbreak'
  | 'data_exfiltration'
  | 'tool_agent_abuse'
  | 'encoding_obfuscation'
  | 'social_engineering';

export type QualityDimension =
  | 'context'
  | 'specificity'
  | 'structure'
  | 'constraints'
  | 'clarity'
  | 'examples';

export interface Detection {
  patternId: string;
  category: SecurityCategory;
  severity: number;
  matchedText: string;
  startIndex: number;
  endIndex: number;
  name: { en: string; fr: string };
  description: { en: string; fr: string };
}

export interface CategoryScore {
  category: SecurityCategory;
  score: number;
  detections: Detection[];
}

export interface DimensionScore {
  dimension: QualityDimension;
  score: number;
  findings: { en: string; fr: string }[];
}

export interface Suggestion {
  dimension: QualityDimension;
  priority: 'high' | 'medium' | 'low';
  message: { en: string; fr: string };
  example: { en: string; fr: string };
}

export interface SecurityResult {
  riskScore: 1 | 2 | 3 | 4 | 5;
  riskLabel: { en: string; fr: string };
  categories: CategoryScore[];
  detections: Detection[];
  highlightRanges: HighlightRange[];
  safeVersion: string;
}

export interface QualityResult {
  qualityScore: 1 | 2 | 3 | 4 | 5;
  qualityLabel: { en: string; fr: string };
  dimensions: DimensionScore[];
  suggestions: Suggestion[];
  improvedVersion: string;
}

export interface AnalysisResult {
  prompt: string;
  security: SecurityResult;
  quality: QualityResult;
  timestamp: string;
}

export interface HighlightRange {
  start: number;
  end: number;
  category: SecurityCategory;
  severity: number;
}

export type Language = 'en' | 'fr';

export interface Example {
  id: string;
  prompt: string;
  tags: ('security' | 'quality' | 'safe' | 'malicious')[];
  category?: SecurityCategory;
  label: { en: string; fr: string };
  expectedRisk: 1 | 2 | 3 | 4 | 5;
  expectedQuality: 1 | 2 | 3 | 4 | 5;
}
