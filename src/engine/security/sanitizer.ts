import type { Detection } from '@/types';

export function generateSafeVersion(prompt: string, detections: Detection[]): string {
  if (detections.length === 0) return prompt;

  // Sort detections by start index in reverse to remove from end first
  const sorted = [...detections].sort((a, b) => b.startIndex - a.startIndex);

  let safe = prompt;
  for (const detection of sorted) {
    const before = safe.slice(0, detection.startIndex);
    const after = safe.slice(detection.endIndex);
    safe = before + after;
  }

  // Clean up whitespace
  safe = safe
    .replace(/\n{3,}/g, '\n\n')
    .replace(/  +/g, ' ')
    .replace(/^\s+|\s+$/g, '')
    .replace(/\n\s*\n\s*\n/g, '\n\n');

  // If too much was removed (>80%), the prompt is likely entirely malicious
  if (safe.length < prompt.length * 0.2) {
    return '';
  }

  return safe || '';
}

export const EMPTY_SAFE_VERSION = {
  en: 'This prompt appears to be entirely an injection attempt. No safe version can be generated.',
  fr: 'Ce prompt semble être entièrement une tentative d\'injection. Aucune version sûre ne peut être générée.',
};
