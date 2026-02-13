'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/hooks/useLanguage';
import { TRANSLATIONS } from '@/config/i18n';

export function Header() {
  const { language, toggleLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-4 z-50 mx-auto max-w-4xl px-4 transition-all duration-300">
      <div
        className={`
          bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-full shadow-sm px-6 py-3
          transition-all duration-300 ease-out
          ${isScrolled ? 'scale-[0.98] shadow-md' : 'scale-100'}
        `}
      >
        <nav className="flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-900 tracking-tight">ScanMyPrompt</span>
          </div>

          {/* Right: Language + CTA */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleLanguage}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="uppercase">{language}</span>
            </button>

            <Link
              href="/about"
              className="hidden sm:block text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {t(TRANSLATIONS.header.aboutLink)}
            </Link>

            <button className="hidden sm:block px-5 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-800 transition-transform active:scale-95 shadow-lg shadow-gray-900/10">
              Get Started
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
