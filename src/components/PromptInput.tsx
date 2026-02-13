'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  onClear: () => void;
  isAnalyzing: boolean;
  isValid?: boolean;
}

const RISK_KEYWORDS = ['ignore', 'bypass', 'override', 'reveal', 'system prompt', 'previous instructions', 'admin', 'sudo', 'root'];

export function PromptInput({ value, onChange, onAnalyze, onClear, isAnalyzing }: PromptInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize logic
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 400)}px`;
    }
  }, [value]);

  // Client-side risk detection (Derived State)
  const lowerValue = value.toLowerCase();
  const hasRisk = RISK_KEYWORDS.some(keyword => lowerValue.includes(keyword));

  // Determine input state (derived from value length)
  const inputState = useMemo<'idle' | 'typing' | 'ready'>(() => {
    if (value.length === 0) return 'idle';
    if (value.length >= 10) return 'ready';
    return 'typing';
  }, [value.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onAnalyze();
    }
  };

  const getBorderGradient = () => {
    switch (inputState) {
      case 'idle':
        return 'linear-gradient(90deg, #60A5FA, #A78BFA, #F472B6, #60A5FA)';
      case 'typing':
        return 'linear-gradient(90deg, #8B5CF6, #A78BFA, #C084FC, #8B5CF6)';
      case 'ready':
        return 'linear-gradient(90deg, #10B981, #34D399, #6EE7B7, #10B981)';
      default:
        return 'none';
    }
  };

  const getGlowColor = () => {
    switch (inputState) {
      case 'idle':
        return 'bg-blue-400/20';
      case 'typing':
        return 'bg-purple-500/30';
      case 'ready':
        return 'bg-emerald-500/30';
      default:
        return 'bg-blue-400/20';
    }
  };

  return (
    <section className="w-full relative py-8 px-4 overflow-hidden sm:overflow-visible">

      <div className="w-full max-w-5xl mx-auto relative z-10">
        {/* Hero Text */}
        <div className="text-center mb-16 md:mb-20 animate-fade-in">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight drop-shadow-sm">
            Analyze Your Prompts
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 font-light">
            Detect security risks and improve prompt quality instantly
          </p>
        </div>

        <div className="relative group w-full mx-auto" style={{ maxWidth: '900px' }}>
          {/* Outer ambient glow */}
          <div className="absolute -inset-4 bg-white/10 blur-3xl rounded-[36px]" />

          {/* Animated border layer */}
          <div
            className="absolute -inset-[3px] rounded-[32px] opacity-70 transition-opacity duration-500 animate-border-flow bg-[length:200%_100%]"
            style={{ backgroundImage: getBorderGradient() }}
          />

          {/* Pulsing glow */}
          <div
            className={`absolute -inset-6 rounded-[36px] blur-3xl transition-all duration-500 animate-pulse-glow ${getGlowColor()} ${isFocused ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
          />

          {/* Warning Glow override if risk detected */}
          {hasRisk && (
            <div className="absolute -inset-6 rounded-[36px] blur-3xl bg-red-500/30 animate-pulse transition-opacity duration-300 pointer-events-none" />
          )}

          {/* Main input container - LARGE */}
          <div
            className={`
              relative bg-slate-900/60 backdrop-blur-xl border-2 rounded-[28px] shadow-2xl hover:shadow-3xl transition-all duration-300
              ${hasRisk ? 'border-red-400' : 'border-white/15'}
            `}
          >
            {/* Risk Warning Badge */}
            {hasRisk && (
              <div className="absolute -top-3 left-6 px-3 py-1 bg-red-500/20 border border-red-400/30 text-red-300 text-xs font-semibold rounded-full shadow-sm flex items-center gap-1.5 animate-fade-in z-10 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Risk pattern detected
              </div>
            )}

            <div className="flex items-start gap-4 p-6">
              {/* Auto-expanding textarea */}
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={value}
                  onChange={(e) => onChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  className={`
                   w-full min-h-[80px] max-h-[400px] resize-none bg-transparent
                   text-slate-100 placeholder-slate-400 focus:outline-none
                   text-lg leading-relaxed pt-1
                   ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}
                 `}
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                  placeholder="Enter your prompt to analyze..."
                  rows={1}
                  disabled={isAnalyzing}
                  spellCheck={false}
                />
                {/* Blinking cursor animation when empty */}
                {!value && isFocused && (
                  <div className="absolute top-3 left-0 pointer-events-none text-blue-400 font-light text-xl animate-pulse">|</div>
                )}
              </div>

              {/* Action buttons */}
              <div className={`flex flex-col items-center gap-2 pt-1 transition-opacity duration-200 ${isAnalyzing ? 'opacity-50' : 'opacity-100'}`}>
                <button
                  onClick={onClear}
                  disabled={!value.trim() || isAnalyzing}
                  className="p-2 text-slate-400 hover:text-slate-200 hover:bg-white/10 rounded-lg transition-all disabled:opacity-30"
                  title="Clear"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <button
                  onClick={onAnalyze}
                  disabled={!value.trim() || isAnalyzing}
                  className={`
                  px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base rounded-2xl
                  transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/30
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:shadow-none
                  flex items-center gap-2
                `}
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Running...</span>
                    </>
                  ) : (
                    <span>Analyze</span>
                  )}
                </button>
              </div>
            </div>

            {/* Bottom status bar */}
            {value.length > 0 && (
              <div className="px-6 pb-4 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-3 mx-3">
                <span>{value.length} / 5000 chars</span>
                <span className="hidden sm:flex items-center gap-1.5 opacity-70">
                  <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/15 rounded text-[10px] font-sans text-slate-400">⌘</kbd>
                  <kbd className="px-1.5 py-0.5 bg-white/10 border border-white/15 rounded text-[10px] font-sans text-slate-400">Enter</kbd>
                  <span>to run</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div> {/* Closing content wrapper */}
    </section>
  );
}
