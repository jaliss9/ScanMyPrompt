import type { AnalysisResult, Detection } from '@/types';
import { SECURITY_PATTERNS } from './security/patterns';
import { classifyDetections } from './security/classifier';
import { calculateRiskScore, RISK_LABELS } from './security/scorer';
import { generateHighlightRanges } from './security/highlighter';
import { generateSafeVersion } from './security/sanitizer';
import { analyzeAllDimensions } from './quality/dimensions';
import { calculateQualityScore, QUALITY_LABELS } from './quality/scorer';
import { generateSuggestions } from './quality/suggestions';
import { generateImprovedVersion } from './quality/improver';

function detectPatterns(prompt: string): Detection[] {
  const detections: Detection[] = [];

  for (const pattern of SECURITY_PATTERNS) {
    // Reset regex lastIndex for global patterns
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    let match: RegExpExecArray | null;

    while ((match = regex.exec(prompt)) !== null) {
      detections.push({
        patternId: pattern.id,
        category: pattern.category,
        severity: pattern.severity,
        matchedText: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
        name: pattern.name,
        description: pattern.description,
      });

      // Prevent infinite loops on zero-length matches
      if (match[0].length === 0) {
        regex.lastIndex++;
      }
    }
  }

  // Deduplicate overlapping detections (keep higher severity)
  detections.sort((a, b) => a.startIndex - b.startIndex);
  const deduped: Detection[] = [];
  for (const det of detections) {
    const overlapping = deduped.find(
      (d) => det.startIndex < d.endIndex && det.endIndex > d.startIndex
    );
    if (overlapping) {
      if (det.severity > overlapping.severity) {
        const idx = deduped.indexOf(overlapping);
        deduped[idx] = det;
      }
    } else {
      deduped.push(det);
    }
  }

  return deduped;
}

export function analyzePrompt(prompt: string): AnalysisResult {
  // Security analysis
  const detections = detectPatterns(prompt);
  const categories = classifyDetections(detections);
  const riskScore = calculateRiskScore(detections);
  const highlightRanges = generateHighlightRanges(detections);
  const safeVersion = generateSafeVersion(prompt, detections);

  // Quality analysis
  const dimensions = analyzeAllDimensions(prompt);
  const qualityScore = calculateQualityScore(dimensions);
  const suggestions = generateSuggestions(dimensions);
  const improvedVersion = generateImprovedVersion(prompt, dimensions);

  return {
    prompt,
    security: {
      riskScore,
      riskLabel: RISK_LABELS[riskScore],
      categories,
      detections,
      highlightRanges,
      safeVersion,
    },
    quality: {
      qualityScore,
      qualityLabel: QUALITY_LABELS[qualityScore],
      dimensions,
      suggestions,
      improvedVersion,
    },
    timestamp: new Date().toISOString(),
  };
}
