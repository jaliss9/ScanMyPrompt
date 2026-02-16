'use client';

import { useLanguage } from '@/hooks/useLanguage';
import { TRANSLATIONS } from '@/config/i18n';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-black py-12 border-t border-gray-900">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-sm text-gray-500 mb-6 max-w-2xl mx-auto leading-relaxed">
          {t(TRANSLATIONS.footer.disclaimer)}
        </p>
        <p className="text-sm text-gray-500">{t(TRANSLATIONS.footer.builtBy)}</p>
      </div>
    </footer>
  );
}
