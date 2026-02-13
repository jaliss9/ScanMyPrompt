'use client';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'safe' | 'low' | 'medium' | 'high' | 'critical' | 'primary' | 'secondary';
  className?: string;
}

const VARIANT_CLASSES: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-white/5 text-slate-300 border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.05)]',
  safe: 'bg-green-500/10 text-green-400 border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]',
  low: 'bg-lime-500/10 text-lime-400 border border-lime-500/20 shadow-[0_0_10px_rgba(132,204,22,0.1)]',
  medium: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]',
  high: 'bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]',
  critical: 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.1)]',
  primary: 'bg-violet-500/10 text-violet-400 border border-violet-500/20 shadow-[0_0_10px_rgba(139,92,246,0.1)]',
  secondary: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.1)]',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${VARIANT_CLASSES[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function riskToBadgeVariant(score: number): NonNullable<BadgeProps['variant']> {
  if (score <= 1) return 'safe';
  if (score <= 2) return 'low';
  if (score <= 3) return 'medium';
  if (score <= 4) return 'high';
  return 'critical';
}

export function qualityToBadgeVariant(score: number): NonNullable<BadgeProps['variant']> {
  if (score >= 5) return 'safe';
  if (score >= 4) return 'low';
  if (score >= 3) return 'medium';
  if (score >= 2) return 'high';
  return 'critical';
}
