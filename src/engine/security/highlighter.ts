import type { Detection, HighlightRange } from '@/types';

export function generateHighlightRanges(detections: Detection[]): HighlightRange[] {
  const ranges: HighlightRange[] = detections.map((d) => ({
    start: d.startIndex,
    end: d.endIndex,
    category: d.category,
    severity: d.severity,
  }));

  // Sort by start index, then by length (longer ranges first for overlapping)
  ranges.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));

  // Merge overlapping ranges, keeping the highest severity
  const merged: HighlightRange[] = [];
  for (const range of ranges) {
    const last = merged[merged.length - 1];
    if (last && range.start <= last.end) {
      last.end = Math.max(last.end, range.end);
      if (range.severity > last.severity) {
        last.severity = range.severity;
        last.category = range.category;
      }
    } else {
      merged.push({ ...range });
    }
  }

  return merged;
}
