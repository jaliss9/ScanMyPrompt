import type { Detection, CategoryScore, SecurityCategory } from '@/types';

const ALL_CATEGORIES: SecurityCategory[] = [
  'system_prompt_override',
  'jailbreak',
  'data_exfiltration',
  'tool_agent_abuse',
  'encoding_obfuscation',
  'social_engineering',
];

export function classifyDetections(detections: Detection[]): CategoryScore[] {
  return ALL_CATEGORIES.map((category) => {
    const categoryDetections = detections.filter((d) => d.category === category);
    const score =
      categoryDetections.length > 0
        ? Math.max(...categoryDetections.map((d) => d.severity))
        : 0;
    return {
      category,
      score,
      detections: categoryDetections,
    };
  });
}
