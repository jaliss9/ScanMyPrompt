'use client';

import type { ReactNode } from 'react';

const VARIANT_CLASSES = {
  primary: 'from-blue-500 to-violet-500 shadow-blue-500/25',
  danger: 'from-red-500 to-pink-500 shadow-red-500/25',
  success: 'from-emerald-500 to-teal-500 shadow-emerald-500/25',
  warning: 'from-orange-500 to-yellow-500 shadow-orange-500/25',
} as const;

interface IconBadgeProps {
  icon: ReactNode;
  variant?: keyof typeof VARIANT_CLASSES;
  className?: string;
}

export function IconBadge({ icon, variant = 'primary', className = '' }: IconBadgeProps) {
  return (
    <div
      className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg ${VARIANT_CLASSES[variant]} ${className}`}
    >
      <span className="text-white [&>svg]:w-6 [&>svg]:h-6">{icon}</span>
    </div>
  );
}
