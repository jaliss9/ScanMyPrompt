'use client';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean; // Whether to apply hover effects
}

export function GlassCard({ children, className = '', hover = false, ...props }: GlassCardProps) {
  // Base glass-panel class from globals.css provides the look
  // We add hover effects if requested
  const baseClass = "glass-panel rounded-2xl p-6 transition-all duration-300";
  const hoverClass = hover ? "hover:shadow-lg hover:-translate-y-1 cursor-pointer" : "";

  return (
    <div className={`${baseClass} ${hoverClass} ${className}`} {...props}>
      {children}
    </div>
  );
}
