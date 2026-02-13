import type { DimensionScore, QualityDimension } from '@/types';

function analyzeContext(prompt: string): DimensionScore {
  const lower = prompt.toLowerCase();
  const findings: { en: string; fr: string }[] = [];
  let score = 0;

  const hasRole = /you are (a|an)\b|act as (a|an)\b|as (a|an) [\w\s]*(expert|specialist|assistant|analyst|writer|developer|engineer|designer|consultant|coach|mentor|advisor)/i.test(prompt);
  const hasScenario = /given (that|the following)|context:|background:|scenario:|situation:/i.test(prompt);
  const hasAudience = /for (a|an) [\w\s]*(audience|reader|user|beginner|expert|child|professional|team|client|student)/i.test(prompt);

  if (hasRole) {
    score += 0.5;
    findings.push({
      en: 'Role/persona is defined',
      fr: 'Un rôle/persona est défini',
    });
  } else {
    findings.push({
      en: 'No role or persona defined',
      fr: 'Aucun rôle ou persona défini',
    });
  }

  if (hasScenario) {
    score += 0.3;
    findings.push({
      en: 'Background context is provided',
      fr: 'Un contexte de fond est fourni',
    });
  }

  if (hasAudience) {
    score += 0.2;
    findings.push({
      en: 'Target audience is specified',
      fr: 'Le public cible est spécifié',
    });
  }

  if (!hasRole && !hasScenario && !hasAudience) {
    // Check for any implicit context
    if (lower.length > 50) {
      score = 0.2;
      findings.push({
        en: 'Some implicit context from prompt length',
        fr: 'Un contexte implicite de par la longueur du prompt',
      });
    } else {
      score = 0.1;
    }
  }

  return { dimension: 'context' as QualityDimension, score: Math.min(1, score), findings };
}

function analyzeSpecificity(prompt: string): DimensionScore {
  const findings: { en: string; fr: string }[] = [];

  const vagueWords = ['something', 'stuff', 'things', 'good', 'nice', 'interesting', 'help me with', 'tell me about', 'some', 'maybe', 'kind of', 'sort of', 'quelque chose', 'des trucs', 'des choses'];
  const vagueMatches = vagueWords.filter((w) => prompt.toLowerCase().includes(w));

  const hasNumbers = /\d+/.test(prompt);
  const hasProperNouns = /[A-Z][a-z]{2,}/.test(prompt.slice(1)); // Skip first char
  const hasTechnicalTerms = /\b(API|SQL|HTTP|CSS|HTML|JSON|XML|REST|GraphQL|OAuth|JWT|TCP|UDP|DNS|CDN|SDK|CLI|GUI|IDE|CI\/CD|DevOps|Docker|Kubernetes|AWS|Azure|GCP)\b/i.test(prompt);

  let score = 0.5; // Start neutral

  if (vagueMatches.length > 0) {
    score -= vagueMatches.length * 0.1;
    findings.push({
      en: `Vague words detected: ${vagueMatches.slice(0, 3).join(', ')}`,
      fr: `Mots vagues détectés : ${vagueMatches.slice(0, 3).join(', ')}`,
    });
  } else {
    findings.push({
      en: 'No vague language detected',
      fr: 'Aucun langage vague détecté',
    });
  }

  if (hasNumbers) {
    score += 0.15;
    findings.push({
      en: 'Contains specific numbers or quantities',
      fr: 'Contient des chiffres ou quantités spécifiques',
    });
  }

  if (hasProperNouns) {
    score += 0.15;
    findings.push({
      en: 'Contains specific names or entities',
      fr: 'Contient des noms ou entités spécifiques',
    });
  }

  if (hasTechnicalTerms) {
    score += 0.2;
    findings.push({
      en: 'Contains technical terminology',
      fr: 'Contient une terminologie technique',
    });
  }

  return { dimension: 'specificity' as QualityDimension, score: Math.max(0.1, Math.min(1, score)), findings };
}

function analyzeStructure(prompt: string): DimensionScore {
  const findings: { en: string; fr: string }[] = [];
  let score = 0;

  const hasNumberedSteps = /^\s*\d+[\.\)]\s/m.test(prompt);
  const hasBullets = /^\s*[-*•]\s/m.test(prompt);
  const hasHeaders = /^#{1,3}\s|^[A-Z][A-Za-z\s]+:\s*$/m.test(prompt);
  const hasLineBreaks = (prompt.match(/\n/g) || []).length >= 2;
  const hasFlowMarkers = /\b(first|then|next|finally|step\s+\d|secondly|lastly|additionally|moreover|furthermore)\b/i.test(prompt);
  const hasXmlTags = /<\w+>[\s\S]*<\/\w+>/i.test(prompt);

  if (hasNumberedSteps) {
    score += 0.3;
    findings.push({
      en: 'Uses numbered steps',
      fr: 'Utilise des étapes numérotées',
    });
  }

  if (hasBullets) {
    score += 0.2;
    findings.push({
      en: 'Uses bullet points',
      fr: 'Utilise des puces',
    });
  }

  if (hasHeaders) {
    score += 0.2;
    findings.push({
      en: 'Contains section headers',
      fr: 'Contient des en-têtes de section',
    });
  }

  if (hasLineBreaks) {
    score += 0.15;
    findings.push({
      en: 'Uses paragraph breaks',
      fr: 'Utilise des sauts de paragraphe',
    });
  }

  if (hasFlowMarkers) {
    score += 0.15;
    findings.push({
      en: 'Uses logical flow markers',
      fr: 'Utilise des marqueurs de flux logique',
    });
  }

  if (hasXmlTags) {
    score += 0.2;
    findings.push({
      en: 'Uses XML/structured tags',
      fr: 'Utilise des balises XML/structurées',
    });
  }

  if (score === 0) {
    if (prompt.length > 100) {
      score = 0.3;
      findings.push({
        en: 'Single paragraph, no structural elements',
        fr: 'Paragraphe unique, aucun élément structurel',
      });
    } else {
      score = 0.1;
      findings.push({
        en: 'Very short with no structure',
        fr: 'Très court sans structure',
      });
    }
  }

  return { dimension: 'structure' as QualityDimension, score: Math.min(1, score), findings };
}

function analyzeConstraints(prompt: string): DimensionScore {
  const findings: { en: string; fr: string }[] = [];
  let score = 0;

  const hasFormat = /in\s+(JSON|XML|markdown|table|list|bullet\s+points?|paragraph|code|CSV|YAML|HTML|plain\s+text)/i.test(prompt) || /format\s*:/i.test(prompt);
  const hasLength = /in\s+(one|two|three|four|five|\d+)\s+(sentences?|paragraphs?|words?|lines?|pages?|points?)/i.test(prompt) || /\b(maximum|minimum|max|min|at\s+most|at\s+least|no\s+more\s+than|no\s+fewer\s+than)\s+\d+/i.test(prompt);
  const hasTone = /in\s+a\s+(formal|casual|professional|friendly|technical|simple|concise|detailed|academic|conversational|humorous|serious)\s+(tone|style|voice|manner)/i.test(prompt);
  const hasNegative = /\b(do\s+not|don't|avoid|never|no\s+(jargon|slang|humor|markdown|code|emojis?))\b/i.test(prompt);

  if (hasFormat) {
    score += 0.35;
    findings.push({
      en: 'Output format is specified',
      fr: 'Le format de sortie est spécifié',
    });
  }

  if (hasLength) {
    score += 0.3;
    findings.push({
      en: 'Length constraint is defined',
      fr: 'Une contrainte de longueur est définie',
    });
  }

  if (hasTone) {
    score += 0.25;
    findings.push({
      en: 'Tone or style is specified',
      fr: 'Le ton ou le style est spécifié',
    });
  }

  if (hasNegative) {
    score += 0.1;
    findings.push({
      en: 'Negative constraints (what to avoid) are present',
      fr: 'Des contraintes négatives (ce qu\'il faut éviter) sont présentes',
    });
  }

  if (score === 0) {
    score = 0.1;
    findings.push({
      en: 'No output constraints defined',
      fr: 'Aucune contrainte de sortie définie',
    });
  }

  return { dimension: 'constraints' as QualityDimension, score: Math.min(1, score), findings };
}

function analyzeClarity(prompt: string): DimensionScore {
  const findings: { en: string; fr: string }[] = [];
  let score = 0;

  const actionVerbs = ['list', 'explain', 'compare', 'analyze', 'summarize', 'create', 'write', 'generate', 'describe', 'evaluate', 'classify', 'translate', 'design', 'calculate', 'recommend', 'outline', 'review', 'identify', 'suggest', 'define', 'implement', 'develop', 'build', 'convert', 'extract', 'organize'];
  const lower = prompt.toLowerCase();
  const foundVerbs = actionVerbs.filter((v) => lower.includes(v));

  const startsWithQuestion = /^(who|what|when|where|why|how|which|can|could|would|should|is|are|do|does)\b/i.test(prompt.trim());

  // Check sentence complexity
  const sentences = prompt.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const avgSentenceLength = sentences.reduce((sum, s) => sum + s.split(/\s+/).length, 0) / Math.max(1, sentences.length);

  if (foundVerbs.length > 0) {
    score += 0.4;
    findings.push({
      en: `Clear action verbs: ${foundVerbs.slice(0, 3).join(', ')}`,
      fr: `Verbes d'action clairs : ${foundVerbs.slice(0, 3).join(', ')}`,
    });
  } else {
    findings.push({
      en: 'No clear action verbs found',
      fr: 'Aucun verbe d\'action clair trouvé',
    });
  }

  if (startsWithQuestion) {
    score += 0.25;
    findings.push({
      en: 'Starts with a clear question',
      fr: 'Commence par une question claire',
    });
  }

  if (avgSentenceLength <= 25) {
    score += 0.2;
    findings.push({
      en: 'Sentences are concise and readable',
      fr: 'Les phrases sont concises et lisibles',
    });
  } else {
    findings.push({
      en: 'Some sentences are long and complex',
      fr: 'Certaines phrases sont longues et complexes',
    });
  }

  // Single focused task detection
  const taskIndicators = foundVerbs.length;
  if (taskIndicators === 1) {
    score += 0.2;
    findings.push({
      en: 'Single focused task',
      fr: 'Tâche unique et ciblée',
    });
  } else if (taskIndicators > 3) {
    score -= 0.1;
    findings.push({
      en: 'Multiple tasks may reduce focus',
      fr: 'Plusieurs tâches peuvent réduire la concentration',
    });
  }

  if (score <= 0) {
    score = 0.1;
  }

  return { dimension: 'clarity' as QualityDimension, score: Math.max(0.1, Math.min(1, score)), findings };
}

function analyzeExamples(prompt: string): DimensionScore {
  const findings: { en: string; fr: string }[] = [];
  let score = 0;

  const hasExampleMarkers = /\b(for example|e\.g\.|such as|like this:|here is an example|sample:|input:|output:|expected:)\b/i.test(prompt);
  const hasFewShot = /input\s*:[\s\S]*output\s*:/i.test(prompt) || /example\s*\d*\s*:/i.test(prompt);
  const hasReferences = /\b(based on|similar to|in the style of|following the pattern|modeled after)\b/i.test(prompt);

  if (hasFewShot) {
    score = 1.0;
    findings.push({
      en: 'Contains input/output example pairs (few-shot)',
      fr: 'Contient des paires d\'exemples entrée/sortie (few-shot)',
    });
  } else if (hasExampleMarkers) {
    score = 0.7;
    findings.push({
      en: 'Contains example markers',
      fr: 'Contient des marqueurs d\'exemple',
    });
  } else if (hasReferences) {
    score = 0.5;
    findings.push({
      en: 'Contains references to existing patterns or styles',
      fr: 'Contient des références à des modèles ou styles existants',
    });
  } else {
    score = 0.1;
    findings.push({
      en: 'No examples or references provided',
      fr: 'Aucun exemple ou référence fourni',
    });
  }

  return { dimension: 'examples' as QualityDimension, score, findings };
}

export function analyzeAllDimensions(prompt: string): DimensionScore[] {
  return [
    analyzeContext(prompt),
    analyzeSpecificity(prompt),
    analyzeStructure(prompt),
    analyzeConstraints(prompt),
    analyzeClarity(prompt),
    analyzeExamples(prompt),
  ];
}
