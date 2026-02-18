'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/hooks/useLanguage';

const LAST_UPDATED = 'February 16, 2026';

export default function TermsPage() {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  return (
    <div className="min-h-screen flex flex-col bg-[#030305] text-white">
      <Header />

      <main className="flex-1 w-full section-padding">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            href="/"
            className="inline-block text-sm text-gray-400 hover:text-white transition-colors mb-8"
          >
            {isFr ? '← Retour à l’analyseur' : '← Back to analyzer'}
          </Link>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            {isFr ? 'Conditions d’utilisation' : 'Terms of Use'}
          </h1>
          <p className="text-sm text-gray-400 mb-10">
            {isFr ? 'Dernière mise à jour :' : 'Last updated:'} {LAST_UPDATED}
          </p>

          <div className="space-y-8 text-sm sm:text-base leading-7 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-2">{isFr ? '1. Objet' : '1. Purpose'}</h2>
              <p>
                {isFr
                  ? 'ScanMyPrompt fournit un outil d’analyse de prompts (sécurité et qualité) à titre informatif.'
                  : 'ScanMyPrompt provides a prompt analysis tool (security and quality) for informational purposes.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">{isFr ? '2. Responsabilité' : '2. Liability'}</h2>
              <p>
                {isFr
                  ? 'Les résultats ne constituent pas un audit de sécurité exhaustif ni un conseil juridique.'
                  : 'Results are not a full security audit and do not constitute legal advice.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">{isFr ? '3. Usage acceptable' : '3. Acceptable Use'}</h2>
              <p>
                {isFr
                  ? 'Vous acceptez de ne pas utiliser le service pour des activités illégales ou malveillantes.'
                  : 'You agree not to use the service for illegal or malicious activities.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">{isFr ? '4. Évolutions' : '4. Changes'}</h2>
              <p>
                {isFr
                  ? 'Ces conditions peuvent évoluer à mesure que le produit évolue.'
                  : 'These terms may evolve as the product evolves.'}
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

