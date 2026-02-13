import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/hooks/useLanguage";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScanMyPrompt — AI Prompt Security & Quality Analyzer",
  description:
    "Analyze your LLM prompts for security vulnerabilities and quality improvements. Client-side, bilingual (EN/FR), free.",
  openGraph: {
    title: "ScanMyPrompt — AI Prompt Security & Quality Analyzer",
    description:
      "Analyze your LLM prompts for security vulnerabilities and quality improvements.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <LanguageProvider>
          <div className="min-h-screen relative overflow-hidden bg-gray-50/50">
            {/* Fixed gradient background - Top Only */}
            <div className="fixed inset-0 -z-20">
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    linear-gradient(
                      180deg,
                      #1e3a8a 0%,
                      #1e40af 8%,
                      #3b82f6 16%,
                      #6366f1 28%,
                      #8b5cf6 40%,
                      #a855f7 52%,
                      #c026d3 62%,
                      #db2777 72%,
                      #e11d48 80%,
                      #f9a8d4 88%,
                      #fce7f3 94%,
                      #ffffff 100%
                    )
                  `
                }}
              />

              {/* Noise texture */}
              <div
                className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"
                }}
              />

              {/* Radial glow center */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(ellipse 80% 50% at 50% 40%, rgba(139, 92, 246, 0.3), transparent)'
                }}
              />
            </div>

            {/* Content with z-index to sit above background */}
            <div className="relative z-10">
              {children}
            </div>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
