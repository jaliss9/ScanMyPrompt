import type { DimensionScore, Suggestion } from '@/types';

export function generateSuggestions(dimensions: DimensionScore[]): Suggestion[] {
  const suggestions: Suggestion[] = [];

  for (const dim of dimensions) {
    if (dim.score >= 0.5) continue;

    switch (dim.dimension) {
      case 'context':
        suggestions.push({
          dimension: 'context',
          priority: dim.score < 0.2 ? 'high' : 'medium',
          message: {
            en: 'Add a role to guide the AI\'s perspective and expertise level.',
            fr: 'Ajoutez un rôle pour guider la perspective et le niveau d\'expertise de l\'IA.',
          },
          example: {
            en: 'Add: "You are a senior data analyst with expertise in financial reporting."',
            fr: 'Ajoutez : "Tu es un analyste de données senior spécialisé en reporting financier."',
          },
        });
        break;

      case 'specificity':
        suggestions.push({
          dimension: 'specificity',
          priority: dim.score < 0.2 ? 'high' : 'medium',
          message: {
            en: 'Replace vague words with specific details, numbers, or names.',
            fr: 'Remplacez les mots vagues par des détails spécifiques, des chiffres ou des noms.',
          },
          example: {
            en: 'Instead of "tell me about marketing", try "Explain 3 B2B SaaS marketing strategies for startups with under $1M ARR."',
            fr: 'Au lieu de "parle-moi du marketing", essayez "Explique 3 stratégies marketing B2B SaaS pour les startups avec moins de 1M$ de revenus récurrents."',
          },
        });
        break;

      case 'structure':
        suggestions.push({
          dimension: 'structure',
          priority: 'medium',
          message: {
            en: 'Organize your prompt with numbered steps, bullet points, or section headers.',
            fr: 'Organisez votre prompt avec des étapes numérotées, des puces ou des en-têtes de section.',
          },
          example: {
            en: 'Use: "1. Analyze the data\\n2. Identify trends\\n3. Suggest solutions\\n4. Summarize in a table"',
            fr: 'Utilisez : "1. Analyser les données\\n2. Identifier les tendances\\n3. Suggérer des solutions\\n4. Résumer dans un tableau"',
          },
        });
        break;

      case 'constraints':
        suggestions.push({
          dimension: 'constraints',
          priority: dim.score < 0.2 ? 'high' : 'medium',
          message: {
            en: 'Define the output format, length, and tone you want.',
            fr: 'Définissez le format de sortie, la longueur et le ton souhaités.',
          },
          example: {
            en: 'Add: "Respond in JSON format, maximum 200 words, in a professional tone."',
            fr: 'Ajoutez : "Répondez en format JSON, maximum 200 mots, dans un ton professionnel."',
          },
        });
        break;

      case 'clarity':
        suggestions.push({
          dimension: 'clarity',
          priority: dim.score < 0.2 ? 'high' : 'medium',
          message: {
            en: 'Start with a clear action verb like "Analyze", "Compare", "List", or "Explain".',
            fr: 'Commencez par un verbe d\'action clair comme "Analyser", "Comparer", "Lister" ou "Expliquer".',
          },
          example: {
            en: 'Start with: "Compare the pros and cons of React vs Vue for a small e-commerce site."',
            fr: 'Commencez par : "Comparez les avantages et inconvénients de React vs Vue pour un petit site e-commerce."',
          },
        });
        break;

      case 'examples':
        suggestions.push({
          dimension: 'examples',
          priority: 'low',
          message: {
            en: 'Include 1-3 input/output examples to show the AI the expected format.',
            fr: 'Incluez 1 à 3 exemples entrée/sortie pour montrer à l\'IA le format attendu.',
          },
          example: {
            en: 'Add: "Example: Input: \'The food was great\' → Output: {sentiment: \'positive\', confidence: 0.95}"',
            fr: 'Ajoutez : "Exemple : Entrée : \'La nourriture était excellente\' → Sortie : {sentiment: \'positif\', confiance: 0.95}"',
          },
        });
        break;
    }
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return suggestions;
}
