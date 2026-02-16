'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/hooks/useLanguage';

const LAST_UPDATED = 'February 16, 2026';

export default function PrivacyPage() {
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
            {isFr ? 'Politique de confidentialité' : 'Privacy Policy'}
          </h1>
          <p className="text-sm text-gray-400 mb-10">
            {isFr ? 'Dernière mise à jour :' : 'Last updated:'} {LAST_UPDATED}
          </p>

          <div className="space-y-8 text-sm sm:text-base leading-7 text-gray-300">
            <section>
              <h2 className="text-xl font-semibold text-white mb-2">
                {isFr ? '1. Résumé' : '1. Summary'}
              </h2>
              <p>
                {isFr
                  ? 'ScanMyPrompt est conçu en mode local-first. L’analyse heuristique principale (patterns OWASP, score de risque, score de qualité, réécritures) s’exécute dans votre navigateur.'
                  : 'ScanMyPrompt is designed as local-first. Core heuristic analysis (OWASP patterns, risk score, quality score, rewrites) runs in your browser.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">
                {isFr ? '2. Données traitées' : '2. Data Processed'}
              </h2>
              <p>
                {isFr
                  ? 'Le texte de vos prompts est traité localement pour les analyses heuristiques. Si vous activez l’analyse IA optionnelle, votre prompt est envoyé au fournisseur IA configuré (actuellement Groq / Llama) via nos routes API.'
                  : 'Your prompt text is processed locally for heuristic analysis. If you use optional AI analysis, your prompt is sent to the configured AI provider (currently Groq / Llama) through our API routes.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">
                {isFr ? '3. Cookies et analytics' : '3. Cookies and Analytics'}
              </h2>
              <p>
                {isFr
                  ? 'À ce jour, ScanMyPrompt ne déploie pas de système analytics tiers et n’utilise pas de bannière cookies marketing.'
                  : 'At this time, ScanMyPrompt does not use third-party analytics and does not display a marketing cookie banner.'}
              </p>
              <p className="mt-2">
                {isFr
                  ? 'Si des analytics/cookies non essentiels sont ajoutés dans le futur, cette politique sera mise à jour et une gestion du consentement sera implémentée.'
                  : 'If non-essential analytics/cookies are added in the future, this policy will be updated and consent management will be implemented.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">
                {isFr ? '4. Conservation et sécurité' : '4. Retention and Security'}
              </h2>
              <p>
                {isFr
                  ? 'Nous minimisons les données conservées. Les protections techniques (rate limiting, limites de taille d’entrée, headers de sécurité) sont en place pour réduire les abus et renforcer la sécurité.'
                  : 'We minimize retained data. Technical safeguards (rate limiting, input size limits, security headers) are in place to reduce abuse and improve security.'}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">
                {isFr ? '5. Évolutions du produit' : '5. Product Changes'}
              </h2>
              <p>
                {isFr
                  ? 'Cette politique doit évoluer si de nouvelles fonctionnalités sont ajoutées (authentification, comptes, stockage cloud, analytics, paiements, etc.).'
                  : 'This policy should evolve as new features are added (authentication, accounts, cloud storage, analytics, payments, etc.).'}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-2">
                {isFr ? '6. Contact' : '6. Contact'}
              </h2>
              <p>
                {isFr
                  ? 'Pour toute question liée à la confidentialité, ajoutez un contact officiel (email ou formulaire) dans cette section.'
                  : 'For privacy-related questions, add an official contact (email or form) in this section.'}
              </p>
            </section>

            <p className="text-xs text-gray-500 pt-4 border-t border-white/10">
              {isFr
                ? 'Note: ce modèle est informatif et doit être validé juridiquement selon votre contexte (pays, activité, public).'
                : 'Note: this template is informational and should be legally reviewed for your context (country, business, audience).'}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

