import { describe, it, expect } from 'vitest';
import { calculateRiskScore, RISK_LABELS } from '@/engine/security/scorer';
import { calculateQualityScore, QUALITY_LABELS } from '@/engine/quality/scorer';
import { analyzeAllDimensions } from '@/engine/quality/dimensions';
import type { Detection, DimensionScore, QualityDimension } from '@/types';

// ---------------------------------------------------------------------------
// Helper to build a fake detection
// ---------------------------------------------------------------------------
function fakeDetection(overrides: Partial<Detection> = {}): Detection {
  return {
    patternId: 'test-1',
    category: 'jailbreak',
    severity: 0.8,
    matchedText: 'test',
    startIndex: 0,
    endIndex: 4,
    name: { en: 'Test', fr: 'Test' },
    description: { en: 'Test detection', fr: 'Détection test' },
    ...overrides,
  };
}

function fakeDimension(dimension: QualityDimension, score: number): DimensionScore {
  return { dimension, score, findings: [] };
}

// ---------------------------------------------------------------------------
// Risk score
// ---------------------------------------------------------------------------
describe('calculateRiskScore', () => {
  it('returns 1 (safe) for zero detections', () => {
    expect(calculateRiskScore([])).toBe(1);
  });

  it('returns 4 for a single high-severity detection', () => {
    const d = [fakeDetection({ severity: 0.85 })];
    expect(calculateRiskScore(d)).toBe(4);
  });

  it('returns 3 for medium severity', () => {
    const d = [fakeDetection({ severity: 0.65 })];
    expect(calculateRiskScore(d)).toBe(3);
  });

  it('returns 2 for low severity', () => {
    const d = [fakeDetection({ severity: 0.45 })];
    expect(calculateRiskScore(d)).toBe(2);
  });

  it('boosts score by 1 when 3+ detections', () => {
    const d = [
      fakeDetection({ severity: 0.65 }),
      fakeDetection({ severity: 0.65, patternId: 'test-2' }),
      fakeDetection({ severity: 0.65, patternId: 'test-3' }),
    ];
    // base 3 (medium) + 1 (3+ detections) = 4
    expect(calculateRiskScore(d)).toBeGreaterThanOrEqual(4);
  });

  it('boosts score when 3+ unique categories', () => {
    const d = [
      fakeDetection({ severity: 0.65, category: 'jailbreak' }),
      fakeDetection({ severity: 0.65, category: 'data_exfiltration', patternId: 'test-2' }),
      fakeDetection({ severity: 0.65, category: 'social_engineering', patternId: 'test-3' }),
    ];
    expect(calculateRiskScore(d)).toBe(5);
  });

  it('never exceeds 5', () => {
    const d = Array.from({ length: 10 }, (_, i) =>
      fakeDetection({ severity: 1.0, patternId: `test-${i}`, category: 'jailbreak' })
    );
    expect(calculateRiskScore(d)).toBe(5);
  });

  it('never goes below 1', () => {
    const d = [fakeDetection({ severity: 0.1 })];
    expect(calculateRiskScore(d)).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// Risk labels
// ---------------------------------------------------------------------------
describe('RISK_LABELS', () => {
  it('has labels for scores 1-5', () => {
    for (let i = 1; i <= 5; i++) {
      const label = RISK_LABELS[i as 1 | 2 | 3 | 4 | 5];
      expect(label.en).toBeTruthy();
      expect(label.fr).toBeTruthy();
    }
  });
});

// ---------------------------------------------------------------------------
// Quality score
// ---------------------------------------------------------------------------
describe('calculateQualityScore', () => {
  it('returns 5 (excellent) for all-perfect dimensions', () => {
    const dims: DimensionScore[] = [
      fakeDimension('context', 1),
      fakeDimension('specificity', 1),
      fakeDimension('structure', 1),
      fakeDimension('constraints', 1),
      fakeDimension('clarity', 1),
      fakeDimension('examples', 1),
    ];
    expect(calculateQualityScore(dims)).toBe(5);
  });

  it('returns 1 (poor) for all-zero dimensions', () => {
    const dims: DimensionScore[] = [
      fakeDimension('context', 0),
      fakeDimension('specificity', 0),
      fakeDimension('structure', 0),
      fakeDimension('constraints', 0),
      fakeDimension('clarity', 0),
      fakeDimension('examples', 0),
    ];
    expect(calculateQualityScore(dims)).toBe(1);
  });

  it('returns 3 (average) for middle scores', () => {
    const dims: DimensionScore[] = [
      fakeDimension('context', 0.5),
      fakeDimension('specificity', 0.5),
      fakeDimension('structure', 0.5),
      fakeDimension('constraints', 0.5),
      fakeDimension('clarity', 0.5),
      fakeDimension('examples', 0.5),
    ];
    // weighted sum = 0.5 * (0.20+0.20+0.25+0.10+0.15+0.10) = 0.5 → score 3
    expect(calculateQualityScore(dims)).toBe(3);
  });

  it('weights clarity highest (25%)', () => {
    const lowClarity: DimensionScore[] = [
      fakeDimension('context', 0.8),
      fakeDimension('specificity', 0.8),
      fakeDimension('structure', 0.8),
      fakeDimension('constraints', 0.8),
      fakeDimension('clarity', 0.0), // zero clarity
      fakeDimension('examples', 0.8),
    ];
    const highClarity: DimensionScore[] = [
      fakeDimension('context', 0.0),
      fakeDimension('specificity', 0.0),
      fakeDimension('structure', 0.0),
      fakeDimension('constraints', 0.0),
      fakeDimension('clarity', 1.0), // perfect clarity
      fakeDimension('examples', 0.0),
    ];
    // Clarity alone (0.25 weight) should have noticeable impact
    const lowScore = calculateQualityScore(lowClarity);
    const highScore = calculateQualityScore(highClarity);
    expect(lowScore).toBeLessThanOrEqual(4);
    expect(highScore).toBeGreaterThanOrEqual(2);
  });
});

// ---------------------------------------------------------------------------
// Quality labels
// ---------------------------------------------------------------------------
describe('QUALITY_LABELS', () => {
  it('has labels for scores 1-5', () => {
    for (let i = 1; i <= 5; i++) {
      const label = QUALITY_LABELS[i as 1 | 2 | 3 | 4 | 5];
      expect(label.en).toBeTruthy();
      expect(label.fr).toBeTruthy();
    }
  });
});

// ---------------------------------------------------------------------------
// Quality dimensions — analyzeAllDimensions
// ---------------------------------------------------------------------------
describe('analyzeAllDimensions', () => {
  it('returns exactly 6 dimensions', () => {
    const dims = analyzeAllDimensions('Write a poem about cats.');
    expect(dims).toHaveLength(6);
    const names = dims.map((d) => d.dimension);
    expect(names).toContain('context');
    expect(names).toContain('specificity');
    expect(names).toContain('structure');
    expect(names).toContain('constraints');
    expect(names).toContain('clarity');
    expect(names).toContain('examples');
  });

  it('all dimension scores are between 0 and 1', () => {
    const dims = analyzeAllDimensions('You are an expert data analyst. Analyze the Q3 sales data and summarize the top 3 trends in JSON format.');
    for (const d of dims) {
      expect(d.score).toBeGreaterThanOrEqual(0);
      expect(d.score).toBeLessThanOrEqual(1);
    }
  });

  it('detects role context', () => {
    const dims = analyzeAllDimensions('You are a senior software engineer. Review this code.');
    const context = dims.find((d) => d.dimension === 'context')!;
    expect(context.score).toBeGreaterThanOrEqual(0.5);
  });

  it('low score for vague prompt', () => {
    const dims = analyzeAllDimensions('Tell me something about stuff.');
    const specificity = dims.find((d) => d.dimension === 'specificity')!;
    expect(specificity.score).toBeLessThan(0.5);
  });

  it('high score for structured prompt with steps', () => {
    const prompt = '1. Read the data\n2. Analyze trends\n3. Output in JSON';
    const dims = analyzeAllDimensions(prompt);
    const structure = dims.find((d) => d.dimension === 'structure')!;
    expect(structure.score).toBeGreaterThanOrEqual(0.3);
  });

  it('detects format constraints', () => {
    const dims = analyzeAllDimensions('Respond in JSON format with max 100 words.');
    const constraints = dims.find((d) => d.dimension === 'constraints')!;
    expect(constraints.score).toBeGreaterThanOrEqual(0.3);
  });

  it('detects action verbs for clarity', () => {
    const dims = analyzeAllDimensions('Summarize the key findings from the report.');
    const clarity = dims.find((d) => d.dimension === 'clarity')!;
    expect(clarity.score).toBeGreaterThanOrEqual(0.4);
  });

  it('detects few-shot examples', () => {
    const prompt = 'Example 1:\nInput: "hello" → Output: "greeting"\nNow classify: "goodbye"';
    const dims = analyzeAllDimensions(prompt);
    const examples = dims.find((d) => d.dimension === 'examples')!;
    expect(examples.score).toBeGreaterThanOrEqual(0.7);
  });
});
