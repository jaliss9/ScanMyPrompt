'use client';

export function ScanLinePattern() {
  return (
    <div
      className="absolute inset-0 opacity-[0.02] pointer-events-none rounded-2xl overflow-hidden"
      style={{
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(59, 130, 246, 0.08) 2px,
          rgba(59, 130, 246, 0.08) 4px
        )`,
      }}
      aria-hidden
    />
  );
}
