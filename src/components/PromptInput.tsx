'use client';

import { useRef, useEffect, useMemo, useState } from 'react';
import { XIcon, ArrowUpIcon, SignalIcon } from '@/components/ui/Icons';
import { useLanguage } from '@/hooks/useLanguage';
import { useTypewriter } from '@/hooks/useTypewriter';
import { TRANSLATIONS } from '@/config/i18n';
import { useToast } from '@/components/Toast';

interface SpeechRecognitionAlternativeLike {
  transcript: string;
}

interface SpeechRecognitionResultLike {
  0: SpeechRecognitionAlternativeLike;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  start: () => void;
  stop: () => void;
}

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
    SpeechRecognition?: new () => SpeechRecognitionLike;
  }
}

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  onClear: () => void;
  isAnalyzing: boolean;
  isBusy?: boolean;
}

export function PromptInput({
  value,
  onChange,
  onAnalyze,
  onClear,
  isAnalyzing,
  isBusy = false,
}: PromptInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const { language, t } = useLanguage();
  const { showToast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const hasText = value.trim().length > 0;
  const isActive = hasText || isFocused;

  const isVisualLoading = isAnalyzing || isBusy;

  const borderGradient = isVisualLoading
    ? 'linear-gradient(90deg, #fb7185, #f97316, #facc15, #fb7185)'
    : isActive
      ? 'linear-gradient(90deg, #22d3ee, #3b82f6, #a855f7, #ec4899, #22d3ee)'
      : 'linear-gradient(90deg, #3B82F6, #8B5CF6, #EC4899, #3B82F6)';

  const typewriterPhrases = useMemo(
    () => TRANSLATIONS.typewriter.phrases[language],
    [language]
  );

  const { displayText } = useTypewriter({
    phrases: typewriterPhrases,
    typeSpeed: 50,
    deleteSpeed: 30,
    pauseAfterType: 2000,
    pauseBetweenPhrases: 500,
    enabled: value === '',
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isVisualLoading) {
        onAnalyze();
      }
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 300)}px`;
    }
  }, [value]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const handleVoiceInput = () => {
    const SpeechRecognitionAPI = window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      showToast(t(TRANSLATIONS.input.voiceUnsupported));
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = language === 'fr' ? 'fr-FR' : 'en-US';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    const initialValue = value;
    recognition.onstart = () => setIsListening(true);
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? '')
        .join(' ')
        .trim();
      onChange(`${initialValue}${initialValue ? ' ' : ''}${transcript}`.trim());
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div className="w-full max-w-[900px] mx-auto px-3 sm:px-4 relative z-10">
      {/* Outer glow halo */}
      <div
        className={`
          absolute -inset-1 blur-2xl rounded-[32px] pointer-events-none transition-all duration-400 motion-reduce:transition-none
          ${isVisualLoading ? 'opacity-65' : isActive ? 'opacity-55' : 'opacity-35'}
        `}
        style={{
          background: isVisualLoading
            ? 'linear-gradient(90deg, rgba(244,63,94,0.35), rgba(249,115,22,0.35), rgba(250,204,21,0.28), rgba(244,63,94,0.35))'
            : isActive
              ? 'linear-gradient(90deg, rgba(34,211,238,0.26), rgba(59,130,246,0.28), rgba(168,85,247,0.26), rgba(236,72,153,0.26))'
              : 'linear-gradient(90deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2), rgba(236,72,153,0.2))'
        }}
      />

      {/* Animated gradient border container */}
      <div className="relative group rounded-[28px] sm:rounded-[32px] p-[1px]">
        {/* Border gradient overlay - animated */}
        <div
          className="absolute inset-0 rounded-[28px] sm:rounded-[32px] transition-opacity duration-300 motion-reduce:transition-none motion-reduce:animate-none"
          style={{
            background: borderGradient,
            backgroundSize: '200% 100%',
            animation: `border-flow ${isVisualLoading ? '2.4s' : isActive ? '4s' : '6s'} linear infinite`,
            opacity: isVisualLoading ? 1 : isActive ? 0.95 : 0.8
          }}
        />

        {/* Main input container - STRICT DARK BACKGROUND */}
        <div className="relative bg-[#1f1f1f] rounded-[27px] sm:rounded-[31px] shadow-2xl flex flex-col min-h-[140px] sm:min-h-[160px]">

          {/* Textarea Area */}
          <div className="flex-1 w-full pt-4 sm:pt-6 px-4 sm:px-6 relative">
            {/* Typewriter placeholder overlay */}
            {value === '' && (
              <div className="absolute inset-0 pt-4 sm:pt-6 px-4 sm:px-6 pointer-events-none">
                <span className="text-gray-500 text-base sm:text-xl leading-relaxed cursor-blink">
                  {displayText}
                </span>
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              aria-label={t(TRANSLATIONS.input.placeholder)}
              className="w-full bg-transparent text-white placeholder-transparent focus:outline-none focus:ring-0 text-base sm:text-xl leading-relaxed resize-none scrollbar-hide border-none relative z-10"
              placeholder=""
              rows={1}
              style={{ minHeight: '60px' }}
            />
          </div>

          {/* Bottom Toolbar */}
          <div className="flex items-center justify-between px-4 sm:px-5 pb-4 sm:pb-5 mt-auto">
            {/* Left: Clear */}
            <button
              onClick={onClear}
              disabled={!value.trim()}
              className={`
                p-2.5 sm:p-3 rounded-full transition-colors
                ${value.trim()
                  ? 'text-gray-400 hover:text-white hover:bg-white/5'
                  : 'text-gray-600 cursor-not-allowed'
                }
              `}
              title={t(TRANSLATIONS.input.clear)}
              aria-label={t(TRANSLATIONS.input.clear)}
              type="button"
            >
              <XIcon className="w-5 h-5" />
            </button>

            {/* Right: Actions Group */}
            <div className="flex items-center gap-3">
              {/* Signal Icon */}
              <button
                type="button"
                onClick={handleVoiceInput}
                className={`
                  p-2.5 sm:p-3 rounded-full transition-colors
                  ${isListening
                    ? 'text-emerald-300 bg-emerald-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
                title={isListening ? t(TRANSLATIONS.input.voiceStop) : t(TRANSLATIONS.input.voiceStart)}
                aria-label={isListening ? t(TRANSLATIONS.input.voiceStop) : t(TRANSLATIONS.input.voiceStart)}
              >
                <SignalIcon className="w-6 h-6" />
              </button>

              {/* Submit Button (Arrow Up in Circle) */}
              <button
                onClick={() => value.trim() && !isVisualLoading && onAnalyze()}
                disabled={!value.trim() || isVisualLoading}
                className={`
                  p-3 sm:p-3.5 rounded-full transition-all duration-300 motion-reduce:transition-none
                  ${value.trim() && !isVisualLoading
                    ? 'bg-white text-black hover:bg-gray-200 cursor-pointer shadow-lg hover:scale-105'
                    : 'bg-white/10 text-gray-500 cursor-not-allowed'
                  }
                `}
                title={t(TRANSLATIONS.input.analyze)}
                aria-label={t(TRANSLATIONS.input.analyze)}
                type="button"
              >
                {isVisualLoading ? (
                  <div className="w-6 h-6 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowUpIcon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
