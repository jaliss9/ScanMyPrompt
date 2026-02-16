'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode, createElement } from 'react';
import type { Language } from '@/types';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (obj: { en: string; fr: string }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'en' ? 'fr' : 'en'));
  }, []);

  const t = useCallback(
    (obj: { en: string; fr: string }) => obj[language],
    [language]
  );

  return createElement(
    LanguageContext.Provider,
    { value: { language, toggleLanguage, t } },
    children
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
