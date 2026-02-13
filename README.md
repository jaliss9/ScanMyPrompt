# ScanMyPrompt

AI Prompt Security & Quality Analyzer. Analyze your LLM prompts for security vulnerabilities (prompt injection, jailbreak, data exfiltration) and quality improvements (context, specificity, structure, constraints, clarity, examples).

## Features

- **Security Analysis**: Detects 6 categories of prompt injection attacks across 58 regex patterns
  - System Prompt Override
  - Jailbreak
  - Data Exfiltration
  - Tool/Agent Abuse
  - Encoding & Obfuscation
  - Social Engineering
- **Quality Analysis**: Scores prompts across 6 dimensions
  - Context, Specificity, Structure, Constraints, Clarity, Examples
- **Visual Gauges**: Risk score (1-5) and Quality score (1-5) with animated SVG gauges
- **Highlighted Prompt**: Color-coded danger zones in the original prompt
- **Safe Rewrite**: Sanitized version with malicious content removed
- **Quality Radar Chart**: SVG radar chart showing 6 quality dimensions
- **Improvement Suggestions**: Actionable tips with concrete examples
- **Auto-Improved Prompt**: Rules-based rewriting that adds missing elements
- **20 Example Prompts**: Pre-loaded examples for testing (security + quality + mixed)
- **Education Section**: 12 expandable cards covering attack types and best practices
- **Bilingual**: Full EN/FR toggle affecting all UI and analysis output
- **Client-Side**: All analysis runs in the browser, no data sent to servers
- **Export**: Download analysis as Markdown report
- **Share**: Generate shareable URL with encoded prompt
- **BYOK**: Optional API key integration for LLM-enhanced analysis (OpenAI/Anthropic)
- **Dark Theme**: Glassmorphism design with animated background blobs

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Deployment**: Vercel (free tier)
- **Engine**: Heuristic pattern matching (regex + structural analysis), fully client-side

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run build
```

## Deploy

Deploy to Vercel with one click or use the CLI:

```bash
npx vercel
```

## Architecture

```
src/
  app/          - Next.js App Router pages and API routes
  components/   - React components (security/, quality/, ui/)
  engine/       - Analysis engines (security/, quality/)
  config/       - i18n translations and example prompts
  types/        - TypeScript interfaces
  hooks/        - React hooks (useLanguage, useAnalysis)
```

## Built by Jal
