'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';
import { TRANSLATIONS } from '@/config/i18n';

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function LogoMark() {
  return (
    <div className="w-11 h-11 rounded-xl bg-black border border-white/15 flex items-center justify-center shadow-[0_10px_24px_rgba(0,0,0,0.38)]">
      <Image src="/cube-scan.svg" alt="ScanMyPrompt logo" width={24} height={24} />
    </div>
  );
}

export function Header() {
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/about', label: TRANSLATIONS.header.aboutLink },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#060608]/82 backdrop-blur-xl supports-[backdrop-filter]:bg-[#060608]/70">
      <nav className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <LogoMark />
            <p className="font-semibold text-white/95 tracking-tight text-[15px] leading-none">ScanMyPrompt</p>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-xl border border-white/10 bg-white/[0.02]">
            {navLinks.map((link) =>
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-lg transition-colors"
              >
                {t(link.label)}
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all uppercase tracking-wide bg-white/[0.03]"
            >
              {language}
            </button>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? t(TRANSLATIONS.header.closeMenu) : t(TRANSLATIONS.header.openMenu)}
            >
              {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10 space-y-2 animate-slide-down">
            {navLinks.map((link) =>
              <Link
                key={link.href}
                href={link.href}
                className="block py-3 px-4 text-sm font-medium text-slate-300 hover:bg-white/5 hover:text-white rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t(link.label)}
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
