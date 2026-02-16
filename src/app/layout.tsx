import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/hooks/useLanguage";
import { ToastProvider } from "@/components/Toast";
import { LovableBackground } from "@/components/ui/LovableBackground";

export const metadata: Metadata = {
  title: "ScanMyPrompt",
  description: "Secure your AI prompts with advanced analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
      </body>
    </html>
  );
}
