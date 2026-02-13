'use client';

interface ToggleProps {
  left: string;
  right: string;
  active: 'left' | 'right';
  onToggle: () => void;
}

export function Toggle({ left, right, active, onToggle }: ToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="glass-surface p-1 rounded-full flex items-center relative transition-all duration-300 hover:bg-white/5 border border-white/10"
      aria-label={`Switch language to ${active === 'left' ? right : left}`}
    >
      <div
        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-gradient-to-r from-violet-600 to-cyan-500 shadow-md transition-all duration-300 ${active === 'left' ? 'left-1' : 'left-[calc(50%+0px)]'
          }`}
      />

      <span
        className={`relative z-10 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors duration-300 w-16 text-center ${active === 'left'
            ? 'text-white'
            : 'text-slate-400 hover:text-slate-200'
          }`}
      >
        {left}
      </span>
      <span
        className={`relative z-10 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors duration-300 w-16 text-center ${active === 'right'
            ? 'text-white'
            : 'text-slate-400 hover:text-slate-200'
          }`}
      >
        {right}
      </span>
    </button>
  );
}
