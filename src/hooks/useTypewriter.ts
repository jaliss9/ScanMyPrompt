'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseTypewriterOptions {
  phrases: readonly string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseAfterType?: number;
  pauseBetweenPhrases?: number;
  enabled?: boolean;
}

export function useTypewriter({
  phrases,
  typeSpeed = 50,
  deleteSpeed = 30,
  pauseAfterType = 2000,
  pauseBetweenPhrases = 500,
  enabled = true,
}: UseTypewriterOptions) {
  const [displayText, setDisplayText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const charIndexRef = useRef(0);
  const isDeletingRef = useRef(false);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!enabled || phrases.length === 0) {
      // Use setTimeout to avoid synchronous setState in effect body (React 19)
      const resetTimer = setTimeout(() => {
        setDisplayText('');
        setIsTyping(true);
      }, 0);
      clearTimer();
      return () => { clearTimeout(resetTimer); };
    }

    const currentPhrase = phrases[phraseIndex % phrases.length];

    const tick = () => {
      if (isDeletingRef.current) {
        // Deleting
        if (charIndexRef.current > 0) {
          charIndexRef.current--;
          setDisplayText(currentPhrase.slice(0, charIndexRef.current));
          timeoutRef.current = setTimeout(tick, deleteSpeed);
        } else {
          // Done deleting, move to next phrase
          isDeletingRef.current = false;
          setIsTyping(true);
          timeoutRef.current = setTimeout(() => {
            setPhraseIndex((prev) => (prev + 1) % phrases.length);
          }, pauseBetweenPhrases);
        }
      } else {
        // Typing
        if (charIndexRef.current < currentPhrase.length) {
          charIndexRef.current++;
          setDisplayText(currentPhrase.slice(0, charIndexRef.current));
          timeoutRef.current = setTimeout(tick, typeSpeed);
        } else {
          // Done typing, pause then start deleting
          setIsTyping(false);
          timeoutRef.current = setTimeout(() => {
            isDeletingRef.current = true;
            tick();
          }, pauseAfterType);
        }
      }
    };

    // Start typing — use setTimeout to avoid synchronous setState in effect body
    charIndexRef.current = 0;
    isDeletingRef.current = false;
    timeoutRef.current = setTimeout(() => {
      setIsTyping(true);
      setDisplayText('');
      timeoutRef.current = setTimeout(tick, pauseBetweenPhrases);
    }, 0);

    return clearTimer;
  }, [phraseIndex, enabled, phrases, typeSpeed, deleteSpeed, pauseAfterType, pauseBetweenPhrases, clearTimer]);

  // Cleanup on unmount
  useEffect(() => clearTimer, [clearTimer]);

  return { displayText, isTyping };
}
