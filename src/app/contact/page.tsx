'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useLanguage } from '@/hooks/useLanguage';

export default function ContactPage() {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  return (
    <div className="min-h-screen flex flex-col bg-[#030305] text-white">
      <Header />

      <main className="flex-1 w-full section-padding">
        <div className="max-w-3xl mx-auto px-4">
          <Link
            href="/"
            className="inline-block text-sm text-gray-400 hover:text-white transition-colors mb-8"
          >
            {isFr ? '← Retour à l’analyseur' : '← Back to analyzer'}
          </Link>

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            {isFr ? 'Contact' : 'Contact'}
          </h1>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-6 sm:p-8">
            <p className="text-sm sm:text-base text-gray-300 leading-7">
              {isFr
                ? 'Pour toute question produit, confidentialité ou retour UX, utilisez votre canal de contact principal (email support ou formulaire).'
                : 'For product questions, privacy requests, or UX feedback, use your main contact channel (support email or form).'}
            </p>

            <p className="mt-4 text-xs text-gray-500">
              {isFr
                ? 'Conseil: ajoutez ici un email officiel (ex: contact@votredomaine.com).'
                : 'Tip: add your official email here (e.g., contact@yourdomain.com).'}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

