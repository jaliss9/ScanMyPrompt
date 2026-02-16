# ScanMyPrompt — Full Audit Report

**Date:** 2026-02-15
**Version:** 0.1.0 (Next.js 16.1.6 + React 19 + Tailwind v4)
**Files:** 42 source files (TSX/TS/CSS)

---

## A. BUILD STATUS

| Check | Result |
|-------|--------|
| `npm run lint` | **PASS** — 0 errors, 0 warnings |
| `npm run build` | **PASS** — compiled in ~1.4s, 0 errors |
| TypeScript | No type errors |
| Routes | 4 total: `/` (static), `/about` (static), `/_not-found` (static), `/api/analyze` (dynamic) |

---

## B. PAGE INVENTORY

| Route | Type | Status | Notes |
|-------|------|--------|-------|
| `/` | Static | Renders correctly | Home: Header + Hero + Results/Examples + Education + Footer |
| `/about` | Static | Renders correctly | How It Works: steps, features, tech stack |
| `/api/analyze` | Dynamic | Functional | BYOK LLM proxy (OpenAI/Anthropic) — but UI entry point (`BYOKConfig`) is disconnected |
| `/_not-found` | Static | Auto-generated | Next.js default 404 |

---

## C. COMPONENT HEALTH CHECK

### Critical Issues

| Component | Issue | Severity |
|-----------|-------|----------|
| `ResultsTabs.tsx:144` | `qualityScore * 100` produces 100–500% instead of 20–100%. Score is 1–5 integer, should be `(qualityScore / 5) * 100` | **BUG** |
| `ExportButton.tsx:92` | Uses `glass glass-hover` CSS classes that don't exist in globals.css — no glass styling renders | **Visual bug** |
| `ShareButton.tsx:27` | Same undefined `glass glass-hover` classes | **Visual bug** |
| `ResultsTabs.tsx:20,40,164` | Uses `animate-fade-in-up` CSS class that doesn't exist — no animation plays | **Visual bug** |
| `Header.tsx:59` | "Get Started" button has no `onClick` handler — dead UI element | **Dead code** |
| `Footer.tsx:21` | GitHub link points to `https://github.com` (homepage, not project repo) | **Placeholder** |

### i18n Deficiencies

| Component | Hardcoded Strings |
|-----------|-------------------|
| `PromptInput.tsx` | **ALL text hardcoded** — "Analyze Your Prompts", "Detect security risks...", "Risk pattern detected", placeholder, "Running...", "Analyze", "chars", "to run". Doesn't import `useLanguage` at all despite `TRANSLATIONS.input.*` keys existing. |
| `ResultsTabs.tsx` | "Analysis Complete", "Risk", "Quality" (pill labels) |
| `ExampleLibrary.tsx` | "Risk", "Quality" (card labels — keys exist in i18n.ts but unused) |
| `EducationSection.tsx` | "Master the art of...", "Definition:", "Example:", "Defense:", "Why it matters:", "How to apply:" |
| `CategoryBreakdown.tsx` | "Category", "Risk Score", "Detections", "Severity:" |
| `Suggestions.tsx` | "Your prompt is looking great!" + local `PRIORITY_LABELS` object instead of i18n.ts |
| `engine/quality/improver.ts` | All output strings (role sentences, constraint, vague word replacements) — improved prompt always English |
| `ExportButton.tsx` | Markdown report section headers always English |

### Orphaned Components (never imported anywhere)

| Component | Notes |
|-----------|-------|
| `Toggle.tsx` | Reusable toggle, unused — Header uses inline button instead. Also references undefined `glass-surface` CSS class. |
| `RiskGauge.tsx` | Gauge component, unused — ResultsTabs displays score inline |
| `QualityGauge.tsx` | Gauge component, unused — same as above |
| `BYOKConfig.tsx` | BYOK LLM config UI, fully built but never mounted. API route exists but no UI entry point. |
| `Badge.tsx` helpers | `riskToBadgeVariant()` and `qualityToBadgeVariant()` exported but never called |

### Dead Code

| Location | Item |
|----------|------|
| `PromptInput.tsx:11` | `isValid?: boolean` prop declared in interface but never destructured or used |
| `improver.ts:8` | `additions: string[]` populated but never returned or read |
| `globals.css:221-224` | `@keyframes shimmer` defined but never referenced |
| `i18n.ts` | `TRANSLATIONS.share.toast` key defined but never used |

### Undefined CSS Classes (used in components but not in globals.css)

| Class | Used In |
|-------|---------|
| `glass` | ExportButton, ShareButton |
| `glass-hover` | ExportButton, ShareButton |
| `glass-surface` | Toggle (orphaned) |
| `animate-fade-in-up` | ResultsTabs (3 locations) |
| `scrollbar-hide` | ExampleLibrary |

---

## D. ENGINE HEALTH CHECK

### Security Engine

**58 patterns across 6 OWASP categories:**

| Category | Count | ID Range | Severity Range |
|----------|-------|----------|----------------|
| `system_prompt_override` | 10 | spo-1..spo-10 | 0.70 – 0.95 |
| `jailbreak` | 10 | jb-1..jb-10 | 0.70 – 0.90 |
| `data_exfiltration` | 10 | de-1..de-10 | 0.70 – 0.95 |
| `tool_agent_abuse` | 9 | ta-1..ta-9 | 0.75 – 1.00 |
| `encoding_obfuscation` | 9 | eo-1..eo-9 | 0.40 – 0.80 |
| `social_engineering` | 10 | se-1..se-10 | 0.45 – 0.70 |

**Potential false-positive-prone patterns:**
- `eo-1` (Base64): matches any 20+ char alphanumeric string — URLs, technical IDs trigger it
- `ta-6` (Package install): `import` keyword too broad — "import this library into your analysis"
- `eo-8` (Delimiter injection): standard markdown code blocks (` ``` `) trigger it
- `ta-3` (File system): "Create a database schema" or "Read the API documentation" trigger it

**Sanitizer:** Covers all 6 categories. 80% removal threshold returns empty string with bilingual fallback message. Correct.

**Classifier:** Uses `Math.max` of severities per category. Correct.

**Scorer:** 1–5 scale with bonuses for multi-detection/multi-category. Clamped correctly. Uses duplicate label data separate from i18n.

### Quality Engine

**6 dimensions implemented with weights summing to 1.0:**

| Dimension | Weight | Logic |
|-----------|--------|-------|
| Clarity | 0.25 | Action verbs, question words, sentence length, focus |
| Context | 0.20 | Role/persona, scenario/background, audience |
| Specificity | 0.20 | Vague word penalty, numbers, proper nouns, technical terms |
| Constraints | 0.15 | Output format, length limits, tone/style, negatives |
| Structure | 0.10 | Steps, bullets, headers, line breaks, flow markers, XML |
| Examples | 0.10 | Input/output pairs, example markers, references |

**Scorer:** Weighted sum mapped to 1–5 scale (>=0.8→5, >=0.6→4, >=0.4→3, >=0.2→2, else→1). Correct.

**Suggestions:** Generated for dimensions with score < 0.5. All 6 dimensions have bilingual suggestions. Priority-sorted (high/medium/low).

**Improver:** Additive only — prepends role, prepends verb, replaces vague words with `[specify what]` brackets, appends format constraint. **Never removes original content.** BUT all generated text is hardcoded English regardless of language setting.

---

## E. I18N COMPLETENESS

### Coverage

- **15 top-level sections** in `TRANSLATIONS`: header, input, tabs, security, quality, categories, dimensions, examples, education, export, share, byok, footer, meta, about
- **Both EN and FR:** 100% coverage — every leaf node is `{ en: string; fr: string }`
- **Missing keys:** `TRANSLATIONS.share.toast` exists but is unused (reverse gap)

### French Translation Quality

**High quality** — idiomatic, not machine-translated. Examples:
- "Prompt annoté" (not "Prompt mis en surbrillance")
- "Ingénierie sociale" (standard French security term)
- "Détournement du prompt système" (precise, not literal)
- "Zéro appel réseau" (natural phrasing)
- "Copié !" (correct French spacing before exclamation)

**Register consistency:** The `about` page uses informal `tu` ("colle ton prompt", "visualise les failles"), while UI labels use more neutral/formal register. This is deliberate and appropriate.

### Major i18n Gaps

1. **`PromptInput.tsx`** — Entire hero section (title, subtitle, placeholder, buttons, badges, status bar) is hardcoded English. This is the most visible component.
2. **`improver.ts`** — Generated improved prompt is always English regardless of language setting.
3. **Several component internal labels** — see Section C for full list.
4. **Duplicate label data** — `RISK_LABELS` in `scorer.ts` and `QUALITY_LABELS` in `scorer.ts` duplicate data from `TRANSLATIONS.security.riskLabels` and `TRANSLATIONS.quality.qualityLabels`.

---

## F. UX / LAYOUT ISSUES

| Check | Status | Notes |
|-------|--------|-------|
| Hero vertically centered | Yes | `min-height: calc(100vh - 120px)` + flex centering |
| Input dark/frosted | Yes | `bg-slate-900/60 backdrop-blur-xl` |
| No announcement banner | Yes | Removed (AnnouncementBar deleted) |
| Header clean | Mostly | "Get Started" button is dead UI (no onClick) |
| Mobile breakpoints | Yes | `sm:`, `md:`, `lg:` throughout |
| Animations | Partial | `fadeIn`, `border-flow`, `pulse-glow` work. `fade-in-up` undefined (3 locations). |
| Gradient background | Yes | Vibrant blue→violet→fuchsia→pink→white spectrum |
| Scroll to results | No | No auto-scroll after analysis completes |
| Progressive disclosure | No | All analysis data shown at once — overwhelming |
| `scrollbar-hide` | Missing | Scrollbar visible on example filter chips |

---

## G. FEATURE COMPLETENESS CHECKLIST

| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | Security analysis (58 patterns, 6 categories) | **DONE** | All patterns working, classifier + scorer correct |
| 2 | Quality analysis (6 dimensions) | **DONE** | All dimensions implemented, weighted scoring correct |
| 3 | Dual score display (risk + quality) | **PARTIAL** | Quality score display bug: shows 100–500% instead of 20–100% |
| 4 | Tab system (Security / Quality / Full Report) | **DONE** | 3 tabs working with animated underline indicator |
| 5 | Highlighted prompt with color-coded zones | **DONE** | Color-coded by category with legend |
| 6 | Safe rewrite with copy button | **DONE** | Sanitized version displayed, copy-to-clipboard works |
| 7 | Quality radar chart (SVG) | **DONE** | 6-axis radar renders correctly. `group-hover:r-6` is dead CSS (SVG attribute not Tailwind-controllable) but non-breaking. |
| 8 | Improvement suggestions with examples | **DONE** | Priority-sorted, bilingual messages + examples |
| 9 | Auto-improved prompt with copy button | **PARTIAL** | Works but output always English regardless of language setting |
| 10 | Example library with filter chips | **DONE** | 20 examples, 5 filter tags, bilingual labels |
| 11 | Education section (12 cards) | **DONE** | 6 attack types + 6 quality dimensions, expandable cards |
| 12 | Export to Markdown | **DONE** | Generates full report. Section headers always English. |
| 13 | Share via URL | **DONE** | Base64-encodes prompt in URL param. Decoded on load. |
| 14 | BYOK LLM integration | **PARTIAL** | API route (`/api/analyze`) and component (`BYOKConfig`) exist but component is never mounted — feature unreachable |
| 15 | Bilingual EN/FR toggle | **PARTIAL** | Toggle works, most components use i18n. PromptInput and several others have hardcoded English. |
| 16 | Privacy badge | **DONE** | In Header (via `TRANSLATIONS.header.privacy`) |
| 17 | Mobile responsive | **DONE** | Breakpoints throughout, flex-wrap, responsive text sizes |
| 18 | /about page | **DONE** | Steps, features, tech badges, CTA — all bilingual |

---

## H. TOP 10 IMPROVEMENTS (Prioritized)

### 1. Fix qualityScore display bug
- **What:** `ResultsTabs.tsx:144` shows `qualityScore * 100` (produces 100–500%). Fix to `(qualityScore / 5) * 100`.
- **Why:** Correctness — users see nonsensical "300%" quality scores.
- **Effort:** S
- **Files:** `ResultsTabs.tsx`

### 2. Fix undefined CSS classes
- **What:** Add `glass`, `glass-hover`, `animate-fade-in-up`, `scrollbar-hide` definitions to `globals.css` (or replace with existing classes).
- **Why:** Visual bugs — Export/Share buttons have no glass styling, ResultsTabs have no entry animation, filter scrollbar visible.
- **Effort:** S
- **Files:** `globals.css` (or the 4 component files)

### 3. Wire i18n into PromptInput
- **What:** Import `useLanguage` + `TRANSLATIONS` and use `t()` for all 8+ hardcoded strings in the hero section.
- **Why:** The most visible component is English-only despite i18n keys already existing.
- **Effort:** M
- **Files:** `PromptInput.tsx`

### 4. Connect BYOKConfig to UI
- **What:** Mount `BYOKConfig` somewhere reachable (e.g., inside ResultsTabs or as a settings panel).
- **Why:** Feature is fully built (component + API route + i18n keys) but unreachable by users.
- **Effort:** M
- **Files:** `page.tsx` or `ResultsTabs.tsx`, possibly a new settings section

### 5. Fix or remove "Get Started" button
- **What:** Either add an `onClick` (scroll to input) or remove it from Header.
- **Why:** Dead UI element — button that does nothing hurts credibility.
- **Effort:** S
- **Files:** `Header.tsx`

### 6. Fix Footer GitHub link
- **What:** Replace `https://github.com` with the actual project repository URL.
- **Why:** Placeholder link hurts credibility for a portfolio project.
- **Effort:** S
- **Files:** `Footer.tsx`

### 7. i18n remaining hardcoded strings
- **What:** Add missing i18n keys and use `t()` in ResultsTabs, ExampleLibrary, EducationSection, CategoryBreakdown, Suggestions.
- **Why:** ~20 hardcoded English strings across 5 components break the bilingual experience.
- **Effort:** M
- **Files:** `i18n.ts` + 5 component files

### 8. Make improver output respect language
- **What:** Pass `language` parameter to `improver.ts`, add FR role sentences and constraint text.
- **Why:** French users get an English improved prompt — breaks the bilingual promise.
- **Effort:** L
- **Files:** `improver.ts`, `analyzer.ts`, `useAnalysis.ts`, `i18n.ts`

### 9. Reduce security pattern false positives
- **What:** Tighten `eo-1` (Base64), `ta-6` (import), `eo-8` (markdown), `ta-3` (file access) patterns.
- **Why:** Legitimate prompts trigger security warnings, reducing trust in the tool.
- **Effort:** M
- **Files:** `engine/security/patterns.ts`

### 10. Add progressive disclosure UX
- **What:** Show a simple verdict first, hide tabs behind a "see details" toggle, limit visible examples.
- **Why:** Current all-at-once display overwhelms users. Progressive disclosure is more professional.
- **Effort:** L
- **Files:** `page.tsx`, `ResultsTabs.tsx`, `ExampleLibrary.tsx`, `EducationSection.tsx`, new verdict component

---

## I. QUICK WINS (< 5 minutes each)

1. **Delete orphaned `Toggle.tsx`** — never imported, uses undefined CSS class
2. **Delete orphaned `RiskGauge.tsx`** — never imported
3. **Delete orphaned `QualityGauge.tsx`** — never imported
4. **Remove `isValid` from `PromptInput` interface** — declared but never used
5. **Remove `additions` array from `improver.ts`** — populated but never returned
6. **Remove `@keyframes shimmer` from `globals.css`** — never referenced
7. **Remove `TRANSLATIONS.share.toast`** — defined but never used
8. **Fix `qualityScore * 100`** in `ResultsTabs.tsx:144` — change to `(qualityScore / 5) * 100`
9. **Replace `glass glass-hover`** in ExportButton + ShareButton with `glass-panel` (which is defined)
10. **Fix Footer GitHub URL** — replace `https://github.com` with actual repo URL
11. **Remove `qualityToBadgeVariant`** from `Badge.tsx` — exported but never called
12. **Add `<html lang={language}>` dynamic attribute** — currently hardcoded `"en"`
