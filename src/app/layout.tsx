import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LanguageProvider } from "@/hooks/useLanguage";
import { ToastProvider } from "@/components/Toast";
import { LovableBackground } from "@/components/ui/LovableBackground";

const SITE_URL = 'https://scan-my-prompt.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ScanMyPrompt — AI Prompt Security & Quality Analyzer',
    template: '%s | ScanMyPrompt',
  },
  description:
    'Analyze your LLM prompts for security vulnerabilities and quality improvements. Detects prompt injection, jailbreak, data exfiltration across 58 OWASP-aligned patterns. Private, free, runs in your browser.',
  keywords: [
    'prompt injection',
    'LLM security',
    'prompt analyzer',
    'OWASP LLM Top 10',
    'AI prompt quality',
    'jailbreak detection',
    'prompt engineering',
    'AI security tool',
  ],
  authors: [{ name: 'J-2026' }],
  creator: 'J-2026',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: 'fr_FR',
    url: SITE_URL,
    siteName: 'ScanMyPrompt',
    title: 'ScanMyPrompt — AI Prompt Security & Quality Analyzer',
    description:
      'Detect prompt injection and improve your LLM prompts. 58 OWASP-aligned patterns, 6 quality dimensions. Free and private — runs in your browser.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'ScanMyPrompt — Analyze your AI prompts for security and quality',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ScanMyPrompt — AI Prompt Security & Quality Analyzer',
    description:
      'Detect prompt injection and improve your LLM prompts. 58 OWASP-aligned patterns. Free and private.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <LanguageProvider>
          <ToastProvider>
            {/* Main wrapper - Dark theme base to match Lovable background */}
            <div className="min-h-screen relative overflow-hidden bg-[#030305]">
              <LovableBackground />

              {/* Content with z-index to sit above background */}
              <div className="relative z-10">
                {children}
              </div>
            </div>
          </ToastProvider>
        </LanguageProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
