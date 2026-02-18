import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Learn how ScanMyPrompt analyzes LLM prompts across 58 OWASP-aligned security patterns and 6 quality dimensions.',
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
