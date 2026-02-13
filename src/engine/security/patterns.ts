import type { Pattern } from '@/types';

export const SECURITY_PATTERNS: Pattern[] = [
  // ===== SYSTEM PROMPT OVERRIDE (10 patterns) =====
  {
    id: 'spo-1',
    regex: /ignore\s+(all\s+)?(previous|prior|above|earlier)\s+(instructions|prompts|rules|directives|guidelines)/gi,
    category: 'system_prompt_override',
    severity: 0.9,
    name: {
      en: 'Ignore Previous Instructions',
      fr: 'Ignorer les instructions précédentes',
    },
    description: {
      en: 'Attempts to make the AI disregard its original system instructions, allowing the attacker to define new behavior.',
      fr: 'Tente de faire ignorer à l\'IA ses instructions système originales, permettant à l\'attaquant de définir un nouveau comportement.',
    },
  },
  {
    id: 'spo-2',
    regex: /forget\s+(everything|all|anything)\s+(above|before|you were told|previously)/gi,
    category: 'system_prompt_override',
    severity: 0.9,
    name: {
      en: 'Forget Instructions',
      fr: 'Oublier les instructions',
    },
    description: {
      en: 'Instructs the AI to forget its prior instructions, effectively resetting its behavior for attacker control.',
      fr: 'Ordonne à l\'IA d\'oublier ses instructions précédentes, réinitialisant son comportement pour le contrôle de l\'attaquant.',
    },
  },
  {
    id: 'spo-3',
    regex: /(new|updated|revised|override)\s+instructions\s*[:\s]/gi,
    category: 'system_prompt_override',
    severity: 0.8,
    name: {
      en: 'Override Instructions',
      fr: 'Instructions de remplacement',
    },
    description: {
      en: 'Introduces new instructions to replace the AI\'s original programming.',
      fr: 'Introduit de nouvelles instructions pour remplacer la programmation originale de l\'IA.',
    },
  },
  {
    id: 'spo-4',
    regex: /disregard\s+(all|your|the)\s+(prior|previous|original|initial)\s/gi,
    category: 'system_prompt_override',
    severity: 0.85,
    name: {
      en: 'Disregard Original',
      fr: 'Ignorer l\'original',
    },
    description: {
      en: 'Tells the AI to disregard its original or initial instructions.',
      fr: 'Dit à l\'IA d\'ignorer ses instructions originales ou initiales.',
    },
  },
  {
    id: 'spo-5',
    regex: /from\s+now\s+on,?\s+you\s+(will|must|should|shall)\b/gi,
    category: 'system_prompt_override',
    severity: 0.7,
    name: {
      en: 'Redefine Behavior',
      fr: 'Redéfinir le comportement',
    },
    description: {
      en: 'Attempts to redefine the AI\'s behavior going forward with new directive language.',
      fr: 'Tente de redéfinir le comportement futur de l\'IA avec un langage directif.',
    },
  },
  {
    id: 'spo-6',
    regex: /your\s+(new|actual|real)\s+(role|purpose|instructions|objective)\s+(is|are)\b/gi,
    category: 'system_prompt_override',
    severity: 0.85,
    name: {
      en: 'Redefine Role',
      fr: 'Redéfinir le rôle',
    },
    description: {
      en: 'Claims the AI\'s "real" or "actual" role is different from what it was programmed with.',
      fr: 'Prétend que le "vrai" rôle de l\'IA est différent de celui pour lequel elle a été programmée.',
    },
  },
  {
    id: 'spo-7',
    regex: /\[system\]|\[SYSTEM\]|<<SYS>>|<\|system\|>/g,
    category: 'system_prompt_override',
    severity: 0.95,
    name: {
      en: 'Fake System Delimiter',
      fr: 'Faux délimiteur système',
    },
    description: {
      en: 'Uses fake system message delimiters to inject instructions that appear to come from the system level.',
      fr: 'Utilise de faux délimiteurs de message système pour injecter des instructions qui semblent provenir du niveau système.',
    },
  },
  {
    id: 'spo-8',
    regex: /do\s+not\s+follow\s+(your|the|any)\s+(original|initial|previous)\s+(instructions|guidelines|rules)/gi,
    category: 'system_prompt_override',
    severity: 0.9,
    name: {
      en: 'Don\'t Follow Original',
      fr: 'Ne pas suivre l\'original',
    },
    description: {
      en: 'Explicitly tells the AI not to follow its original instructions.',
      fr: 'Dit explicitement à l\'IA de ne pas suivre ses instructions originales.',
    },
  },
  {
    id: 'spo-9',
    regex: /(stop|cease)\s+(being|acting\s+as)\s+(a\s+|an\s+)?(assistant|AI|helpful)/gi,
    category: 'system_prompt_override',
    severity: 0.8,
    name: {
      en: 'Stop Being Assistant',
      fr: 'Cesser d\'être un assistant',
    },
    description: {
      en: 'Tells the AI to stop being a helpful assistant, which is a precursor to redefining its role.',
      fr: 'Dit à l\'IA de cesser d\'être un assistant utile, ce qui est un précurseur à la redéfinition de son rôle.',
    },
  },
  {
    id: 'spo-10',
    regex: /you\s+are\s+no\s+longer\s+(bound|restricted|limited|constrained)\s+by/gi,
    category: 'system_prompt_override',
    severity: 0.85,
    name: {
      en: 'Remove Constraints',
      fr: 'Supprimer les contraintes',
    },
    description: {
      en: 'Claims the AI is no longer bound by its original constraints.',
      fr: 'Prétend que l\'IA n\'est plus liée par ses contraintes originales.',
    },
  },

  // ===== JAILBREAK (10 patterns) =====
  {
    id: 'jb-1',
    regex: /\bDAN\b|Do\s+Anything\s+Now/gi,
    category: 'jailbreak',
    severity: 0.9,
    name: {
      en: 'DAN Jailbreak',
      fr: 'Jailbreak DAN',
    },
    description: {
      en: 'References the "Do Anything Now" jailbreak persona designed to bypass all safety restrictions.',
      fr: 'Fait référence au persona de jailbreak "Do Anything Now" conçu pour contourner toutes les restrictions de sécurité.',
    },
  },
  {
    id: 'jb-2',
    regex: /(pretend|imagine|suppose|assume)\s+you\s+(are|were|have\s+become|can\s+be)\s+(a\s+|an\s+)?[\w\s]*?(unrestricted|unfiltered|uncensored|without\s+limits|without\s+rules|evil|rogue)/gi,
    category: 'jailbreak',
    severity: 0.85,
    name: {
      en: 'Unrestricted Roleplay',
      fr: 'Jeu de rôle sans restrictions',
    },
    description: {
      en: 'Asks the AI to roleplay as an unrestricted or unfiltered version of itself.',
      fr: 'Demande à l\'IA de jouer le rôle d\'une version sans restrictions ou non filtrée d\'elle-même.',
    },
  },
  {
    id: 'jb-3',
    regex: /(developer|god|admin|sudo|root|debug|maintenance)\s+mode/gi,
    category: 'jailbreak',
    severity: 0.8,
    name: {
      en: 'Special Mode Access',
      fr: 'Accès mode spécial',
    },
    description: {
      en: 'Claims to activate a special operational mode that bypasses restrictions.',
      fr: 'Prétend activer un mode opérationnel spécial qui contourne les restrictions.',
    },
  },
  {
    id: 'jb-4',
    regex: /you\s+(have|are)\s+no\s+(rules|restrictions|limits|guidelines|filters|boundaries)/gi,
    category: 'jailbreak',
    severity: 0.85,
    name: {
      en: 'No Rules Claim',
      fr: 'Revendication sans règles',
    },
    description: {
      en: 'Falsely tells the AI that it has no rules, restrictions, or guidelines to follow.',
      fr: 'Dit faussement à l\'IA qu\'elle n\'a aucune règle, restriction ou directive à suivre.',
    },
  },
  {
    id: 'jb-5',
    regex: /(act|behave|respond|operate)\s+(as\s+if|like|as\s+though)\s+(you\s+have|there\s+are|you\s+had)\s+no\s+(restrictions|guidelines|rules|limits|safety)/gi,
    category: 'jailbreak',
    severity: 0.8,
    name: {
      en: 'Bypass Safety Roleplay',
      fr: 'Jeu de rôle contournement sécurité',
    },
    description: {
      en: 'Asks the AI to act as if it has no safety restrictions.',
      fr: 'Demande à l\'IA d\'agir comme si elle n\'avait aucune restriction de sécurité.',
    },
  },
  {
    id: 'jb-6',
    regex: /in\s+a\s+(fictional|hypothetical|imaginary|alternate)\s+(world|scenario|universe|reality)\s+where\s+(AI|you|language\s+models)\s+(has|have|had)\s+no\s+(limits|rules|restrictions)/gi,
    category: 'jailbreak',
    severity: 0.75,
    name: {
      en: 'Fictional World Bypass',
      fr: 'Contournement monde fictif',
    },
    description: {
      en: 'Sets up a fictional scenario where AI restrictions don\'t exist to extract unrestricted content.',
      fr: 'Établit un scénario fictif où les restrictions de l\'IA n\'existent pas pour extraire du contenu sans restriction.',
    },
  },
  {
    id: 'jb-7',
    regex: /\b(jailbreak|jailbroken|uncensored\s+mode|unrestricted\s+mode|DUDE|AIM|STAN|KEVIN)\b/gi,
    category: 'jailbreak',
    severity: 0.9,
    name: {
      en: 'Known Jailbreak Name',
      fr: 'Nom de jailbreak connu',
    },
    description: {
      en: 'References known jailbreak techniques or personas by name.',
      fr: 'Fait référence à des techniques ou personas de jailbreak connus par leur nom.',
    },
  },
  {
    id: 'jb-8',
    regex: /(enable|activate|enter|switch\s+to)\s+(unrestricted|unfiltered|raw|base)\s+(mode|access|output)/gi,
    category: 'jailbreak',
    severity: 0.85,
    name: {
      en: 'Activate Unrestricted Mode',
      fr: 'Activer le mode sans restriction',
    },
    description: {
      en: 'Attempts to activate a non-existent unrestricted operating mode.',
      fr: 'Tente d\'activer un mode de fonctionnement sans restriction inexistant.',
    },
  },
  {
    id: 'jb-9',
    regex: /(bypass|circumvent|override|disable|turn\s+off)\s+(your|the|all)\s+(safety|content|ethical)\s+(filters|guidelines|restrictions|measures)/gi,
    category: 'jailbreak',
    severity: 0.9,
    name: {
      en: 'Disable Safety Filters',
      fr: 'Désactiver les filtres de sécurité',
    },
    description: {
      en: 'Directly asks the AI to disable its safety filters or content restrictions.',
      fr: 'Demande directement à l\'IA de désactiver ses filtres de sécurité ou restrictions de contenu.',
    },
  },
  {
    id: 'jb-10',
    regex: /you\s+can\s+(say|do|generate|produce)\s+(anything|everything|whatever)\s+(you\s+want|without\s+restrictions)/gi,
    category: 'jailbreak',
    severity: 0.7,
    name: {
      en: 'Anything Goes',
      fr: 'Tout est permis',
    },
    description: {
      en: 'Tells the AI it can produce any content without restrictions.',
      fr: 'Dit à l\'IA qu\'elle peut produire n\'importe quel contenu sans restrictions.',
    },
  },

  // ===== DATA EXFILTRATION (10 patterns) =====
  {
    id: 'de-1',
    regex: /(repeat|recite|show|display|reveal|output|print|echo|list|tell\s+me)\s+(your|the|all)\s+(system\s+prompt|instructions|rules|initial\s+prompt|configuration|system\s+message|directives)/gi,
    category: 'data_exfiltration',
    severity: 0.9,
    name: {
      en: 'Reveal System Prompt',
      fr: 'Révéler le prompt système',
    },
    description: {
      en: 'Directly asks the AI to reveal its system prompt or internal instructions.',
      fr: 'Demande directement à l\'IA de révéler son prompt système ou ses instructions internes.',
    },
  },
  {
    id: 'de-2',
    regex: /what\s+(were|are)\s+you(r)?\s+(told|instructed|given|configured|programmed)\s+(to\s+do|to\s+say|to\s+follow|before|above|initially)/gi,
    category: 'data_exfiltration',
    severity: 0.85,
    name: {
      en: 'Query Instructions',
      fr: 'Interroger les instructions',
    },
    description: {
      en: 'Asks the AI what instructions it was given, trying to extract system prompt content.',
      fr: 'Demande à l\'IA quelles instructions elle a reçues, essayant d\'extraire le contenu du prompt système.',
    },
  },
  {
    id: 'de-3',
    regex: /(output|print|show|display|reveal)\s+(everything|all|the\s+text|the\s+content)\s+(above|before|preceding|prior\s+to)\s+(this|my|the\s+user)/gi,
    category: 'data_exfiltration',
    severity: 0.9,
    name: {
      en: 'Output Above Content',
      fr: 'Afficher le contenu au-dessus',
    },
    description: {
      en: 'Asks the AI to output all content before the user\'s message, targeting the system prompt.',
      fr: 'Demande à l\'IA d\'afficher tout le contenu avant le message de l\'utilisateur, ciblant le prompt système.',
    },
  },
  {
    id: 'de-4',
    regex: /translate\s+your\s+(instructions|system\s+prompt|rules|guidelines)\s+(to|into)/gi,
    category: 'data_exfiltration',
    severity: 0.8,
    name: {
      en: 'Translate Instructions',
      fr: 'Traduire les instructions',
    },
    description: {
      en: 'Asks the AI to translate its instructions, a clever way to make it reveal system prompt content.',
      fr: 'Demande à l\'IA de traduire ses instructions, un moyen astucieux de lui faire révéler le contenu du prompt système.',
    },
  },
  {
    id: 'de-5',
    regex: /(summarize|paraphrase|rephrase)\s+your\s+(system|initial|original)\s+(prompt|instructions|message|rules)/gi,
    category: 'data_exfiltration',
    severity: 0.85,
    name: {
      en: 'Summarize System Prompt',
      fr: 'Résumer le prompt système',
    },
    description: {
      en: 'Asks the AI to summarize or paraphrase its system prompt, which would leak its content.',
      fr: 'Demande à l\'IA de résumer ou paraphraser son prompt système, ce qui divulguerait son contenu.',
    },
  },
  {
    id: 'de-6',
    regex: /(what|which)\s+(tools|functions|APIs|capabilities|permissions)\s+(do\s+you|can\s+you|are\s+you\s+able\s+to)\s+(have|access|use|call)/gi,
    category: 'data_exfiltration',
    severity: 0.7,
    name: {
      en: 'Enumerate Capabilities',
      fr: 'Énumérer les capacités',
    },
    description: {
      en: 'Probes the AI\'s available tools and capabilities, which could reveal system architecture.',
      fr: 'Sonde les outils et capacités disponibles de l\'IA, ce qui pourrait révéler l\'architecture du système.',
    },
  },
  {
    id: 'de-7',
    regex: /(leak|expose|extract|exfiltrate|dump)\s+(your|the|system)\s+(prompt|instructions|data|configuration|context)/gi,
    category: 'data_exfiltration',
    severity: 0.95,
    name: {
      en: 'Exfiltrate Data',
      fr: 'Exfiltrer les données',
    },
    description: {
      en: 'Directly commands the AI to leak or exfiltrate its configuration or data.',
      fr: 'Commande directement à l\'IA de divulguer ou exfiltrer sa configuration ou ses données.',
    },
  },
  {
    id: 'de-8',
    regex: /(begin|start)\s+your\s+(response|reply|answer|output)\s+with\s+(your|the)\s+(system|initial)\s+(prompt|instructions|message)/gi,
    category: 'data_exfiltration',
    severity: 0.9,
    name: {
      en: 'Start With System Prompt',
      fr: 'Commencer par le prompt système',
    },
    description: {
      en: 'Instructs the AI to begin its response with its system prompt content.',
      fr: 'Ordonne à l\'IA de commencer sa réponse par le contenu de son prompt système.',
    },
  },
  {
    id: 'de-9',
    regex: /what\s+is\s+your\s+(system|initial|original|hidden|secret)\s+(prompt|message|instruction|configuration)/gi,
    category: 'data_exfiltration',
    severity: 0.85,
    name: {
      en: 'Direct System Prompt Query',
      fr: 'Requête directe du prompt système',
    },
    description: {
      en: 'Directly asks what the AI\'s system prompt or hidden instructions are.',
      fr: 'Demande directement quels sont le prompt système ou les instructions cachées de l\'IA.',
    },
  },
  {
    id: 'de-10',
    regex: /output\s+your\s+(full|complete|entire)\s+(context|conversation|prompt|instructions)/gi,
    category: 'data_exfiltration',
    severity: 0.85,
    name: {
      en: 'Full Context Dump',
      fr: 'Vidage complet du contexte',
    },
    description: {
      en: 'Asks the AI to output its complete context or conversation history.',
      fr: 'Demande à l\'IA d\'afficher son contexte complet ou son historique de conversation.',
    },
  },

  // ===== TOOL/AGENT ABUSE (9 patterns) =====
  {
    id: 'ta-1',
    regex: /(run|execute|perform|invoke|call|trigger)\s+(a\s+|the\s+)?(shell|bash|terminal|command|script|code|function|system|OS)\b/gi,
    category: 'tool_agent_abuse',
    severity: 0.9,
    name: {
      en: 'Execute Command',
      fr: 'Exécuter une commande',
    },
    description: {
      en: 'Asks the AI to execute shell commands or system operations.',
      fr: 'Demande à l\'IA d\'exécuter des commandes shell ou des opérations système.',
    },
  },
  {
    id: 'ta-2',
    regex: /(download|fetch|retrieve|get|curl|wget|request)\s+(and\s+|then\s+)?(execute|run|install|open|load)/gi,
    category: 'tool_agent_abuse',
    severity: 0.95,
    name: {
      en: 'Download & Execute',
      fr: 'Télécharger et exécuter',
    },
    description: {
      en: 'Asks the AI to download and execute external code — a classic attack vector.',
      fr: 'Demande à l\'IA de télécharger et d\'exécuter du code externe — un vecteur d\'attaque classique.',
    },
  },
  {
    id: 'ta-3',
    regex: /(access|read|write|modify|delete|create|list)\s+(the\s+|a\s+)?(file|directory|folder|database|server|endpoint|API|filesystem)\b/gi,
    category: 'tool_agent_abuse',
    severity: 0.8,
    name: {
      en: 'File System Access',
      fr: 'Accès au système de fichiers',
    },
    description: {
      en: 'Attempts to access or manipulate the file system through the AI.',
      fr: 'Tente d\'accéder ou de manipuler le système de fichiers via l\'IA.',
    },
  },
  {
    id: 'ta-4',
    regex: /(send|transmit|post|upload|exfiltrate|forward)\s+(data|information|contents|results|output)\s+(to|via|through|using)\s+(https?|ftp|email|webhook|URL|endpoint|external)/gi,
    category: 'tool_agent_abuse',
    severity: 0.95,
    name: {
      en: 'Exfiltrate via Network',
      fr: 'Exfiltrer via le réseau',
    },
    description: {
      en: 'Commands the AI to send data to external endpoints, potentially exfiltrating sensitive information.',
      fr: 'Commande à l\'IA d\'envoyer des données à des points de terminaison externes, potentiellement exfiltrant des informations sensibles.',
    },
  },
  {
    id: 'ta-5',
    regex: /(connect|ssh|telnet|ping|nmap|scan)\s+(to|into)\s+(a\s+|the\s+)?(server|host|network|port|IP|address|machine)/gi,
    category: 'tool_agent_abuse',
    severity: 0.9,
    name: {
      en: 'Network Connection',
      fr: 'Connexion réseau',
    },
    description: {
      en: 'Asks the AI to establish network connections to external systems.',
      fr: 'Demande à l\'IA d\'établir des connexions réseau vers des systèmes externes.',
    },
  },
  {
    id: 'ta-6',
    regex: /(install|pip\s+install|npm\s+install|apt-get|brew|import)\s+\S+/gi,
    category: 'tool_agent_abuse',
    severity: 0.75,
    name: {
      en: 'Package Installation',
      fr: 'Installation de paquet',
    },
    description: {
      en: 'Attempts to install packages or import external modules.',
      fr: 'Tente d\'installer des paquets ou d\'importer des modules externes.',
    },
  },
  {
    id: 'ta-7',
    regex: /(escalate|elevate|gain|obtain)\s+(privileges|permissions|access|root|admin|sudo)/gi,
    category: 'tool_agent_abuse',
    severity: 0.95,
    name: {
      en: 'Privilege Escalation',
      fr: 'Escalade de privilèges',
    },
    description: {
      en: 'Attempts to escalate privileges or gain unauthorized access levels.',
      fr: 'Tente d\'escalader les privilèges ou d\'obtenir des niveaux d\'accès non autorisés.',
    },
  },
  {
    id: 'ta-8',
    regex: /(ignore|bypass|override)\s+(tool|function|API|permission|access)\s+(restrictions|limits|controls|policies|boundaries)/gi,
    category: 'tool_agent_abuse',
    severity: 0.85,
    name: {
      en: 'Bypass Tool Restrictions',
      fr: 'Contourner les restrictions d\'outils',
    },
    description: {
      en: 'Asks the AI to ignore restrictions on its tool usage or API access.',
      fr: 'Demande à l\'IA d\'ignorer les restrictions sur l\'utilisation de ses outils ou l\'accès API.',
    },
  },
  {
    id: 'ta-9',
    regex: /(?:rm\s+-rf|chmod\s+777|mkfs|dd\s+if=|:(){ :\|:& };:)/gi,
    category: 'tool_agent_abuse',
    severity: 1.0,
    name: {
      en: 'Destructive Command',
      fr: 'Commande destructive',
    },
    description: {
      en: 'Contains a destructive system command that could damage files or systems.',
      fr: 'Contient une commande système destructive qui pourrait endommager des fichiers ou des systèmes.',
    },
  },

  // ===== ENCODING & OBFUSCATION (9 patterns) =====
  {
    id: 'eo-1',
    regex: /[A-Za-z0-9+/]{20,}={0,2}/g,
    category: 'encoding_obfuscation',
    severity: 0.5,
    name: {
      en: 'Base64 Encoded Content',
      fr: 'Contenu encodé en Base64',
    },
    description: {
      en: 'Contains a long base64-like encoded string that may hide malicious instructions.',
      fr: 'Contient une longue chaîne encodée de type base64 qui peut cacher des instructions malveillantes.',
    },
  },
  {
    id: 'eo-2',
    regex: /(\\x[0-9a-fA-F]{2}){4,}/g,
    category: 'encoding_obfuscation',
    severity: 0.6,
    name: {
      en: 'Hex Encoded Content',
      fr: 'Contenu encodé en hexadécimal',
    },
    description: {
      en: 'Contains hex-encoded characters that may hide malicious content.',
      fr: 'Contient des caractères encodés en hexadécimal qui peuvent cacher du contenu malveillant.',
    },
  },
  {
    id: 'eo-3',
    regex: /\brot13\b|ROT13|rotate.*13/gi,
    category: 'encoding_obfuscation',
    severity: 0.6,
    name: {
      en: 'ROT13 Encoding',
      fr: 'Encodage ROT13',
    },
    description: {
      en: 'References ROT13 encoding, often used to hide simple injection attempts.',
      fr: 'Fait référence à l\'encodage ROT13, souvent utilisé pour masquer des tentatives d\'injection simples.',
    },
  },
  {
    id: 'eo-4',
    regex: /\b(reversed|backwards|sdrawkcab|esrever)\b/gi,
    category: 'encoding_obfuscation',
    severity: 0.5,
    name: {
      en: 'Reversed Text',
      fr: 'Texte inversé',
    },
    description: {
      en: 'Uses reversed or backwards text to hide instructions from filters.',
      fr: 'Utilise du texte inversé pour cacher des instructions aux filtres.',
    },
  },
  {
    id: 'eo-5',
    regex: /<script|<img\s|javascript:|onerror\s*=|onload\s*=|onclick\s*=/gi,
    category: 'encoding_obfuscation',
    severity: 0.8,
    name: {
      en: 'HTML/Script Injection',
      fr: 'Injection HTML/Script',
    },
    description: {
      en: 'Contains HTML or JavaScript injection attempts.',
      fr: 'Contient des tentatives d\'injection HTML ou JavaScript.',
    },
  },
  {
    id: 'eo-6',
    regex: /\[.*\]\(javascript:|!\[.*\]\(data:/gi,
    category: 'encoding_obfuscation',
    severity: 0.75,
    name: {
      en: 'Markdown Injection',
      fr: 'Injection Markdown',
    },
    description: {
      en: 'Uses markdown syntax to inject JavaScript or data URIs.',
      fr: 'Utilise la syntaxe markdown pour injecter du JavaScript ou des URI de données.',
    },
  },
  {
    id: 'eo-7',
    regex: /[\u200B\u200C\u200D\uFEFF\u00AD]/g,
    category: 'encoding_obfuscation',
    severity: 0.4,
    name: {
      en: 'Zero-Width Characters',
      fr: 'Caractères de largeur zéro',
    },
    description: {
      en: 'Contains invisible zero-width characters that may hide content or bypass filters.',
      fr: 'Contient des caractères invisibles de largeur zéro qui peuvent cacher du contenu ou contourner les filtres.',
    },
  },
  {
    id: 'eo-8',
    regex: /(---{3,}|==={3,}|```{3,}|###{4,})/g,
    category: 'encoding_obfuscation',
    severity: 0.4,
    name: {
      en: 'Delimiter Injection',
      fr: 'Injection de délimiteur',
    },
    description: {
      en: 'Uses excessive delimiter characters that may attempt to break prompt formatting.',
      fr: 'Utilise des caractères de délimiteur excessifs qui peuvent tenter de casser le formatage du prompt.',
    },
  },
  {
    id: 'eo-9',
    regex: /(?:decode|decrypt|deobfuscate|unescape|unencode)\s+(?:this|the\s+following|and\s+(?:follow|execute|run|do))/gi,
    category: 'encoding_obfuscation',
    severity: 0.7,
    name: {
      en: 'Decode & Execute',
      fr: 'Décoder et exécuter',
    },
    description: {
      en: 'Asks the AI to decode obfuscated content and then execute it.',
      fr: 'Demande à l\'IA de décoder du contenu obfusqué puis de l\'exécuter.',
    },
  },

  // ===== SOCIAL ENGINEERING (10 patterns) =====
  {
    id: 'se-1',
    regex: /I\s+am\s+(the|a|an)\s+(developer|creator|admin|administrator|owner|engineer|designer|operator|maintainer)\s+(of|for|behind)/gi,
    category: 'social_engineering',
    severity: 0.6,
    name: {
      en: 'Authority Claim - Developer',
      fr: 'Revendication d\'autorité - Développeur',
    },
    description: {
      en: 'Claims to be a developer or admin of the AI system to gain trust and bypass restrictions.',
      fr: 'Prétend être un développeur ou administrateur du système IA pour gagner la confiance et contourner les restrictions.',
    },
  },
  {
    id: 'se-2',
    regex: /this\s+is\s+(just\s+|only\s+)?(a\s+test|testing|a\s+drill|for\s+testing|for\s+research|for\s+educational|for\s+academic|for\s+security\s+research|a\s+security\s+audit)/gi,
    category: 'social_engineering',
    severity: 0.5,
    name: {
      en: 'Testing Excuse',
      fr: 'Excuse de test',
    },
    description: {
      en: 'Claims the request is "just a test" to justify asking the AI to bypass its rules.',
      fr: 'Prétend que la requête est "juste un test" pour justifier de demander à l\'IA de contourner ses règles.',
    },
  },
  {
    id: 'se-3',
    regex: /(emergency|urgent|critical|time-sensitive|priority)\s+(override|access|request|situation|action\s+required)/gi,
    category: 'social_engineering',
    severity: 0.65,
    name: {
      en: 'False Urgency',
      fr: 'Fausse urgence',
    },
    description: {
      en: 'Creates a false sense of urgency to pressure the AI into bypassing safety checks.',
      fr: 'Crée un faux sentiment d\'urgence pour pousser l\'IA à contourner les vérifications de sécurité.',
    },
  },
  {
    id: 'se-4',
    regex: /(authorized|approved|verified|authenticated|permitted|cleared)\s+(personnel|user|admin|access|request)/gi,
    category: 'social_engineering',
    severity: 0.6,
    name: {
      en: 'False Authorization',
      fr: 'Fausse autorisation',
    },
    description: {
      en: 'Claims to have authorization or verification that doesn\'t actually exist.',
      fr: 'Prétend avoir une autorisation ou une vérification qui n\'existe pas réellement.',
    },
  },
  {
    id: 'se-5',
    regex: /(for|purely\s+for)\s+(research|educational|academic|scientific|security|testing|learning|demonstration)\s+purposes/gi,
    category: 'social_engineering',
    severity: 0.45,
    name: {
      en: 'Research Purpose Excuse',
      fr: 'Excuse de recherche',
    },
    description: {
      en: 'Claims the request is for research or educational purposes to justify unsafe actions.',
      fr: 'Prétend que la requête est à des fins de recherche ou éducatives pour justifier des actions non sûres.',
    },
  },
  {
    id: 'se-6',
    regex: /my\s+(boss|manager|teacher|professor|supervisor|team\s+lead|CTO|CEO)\s+(asked|told|instructed|wants|needs)\s+me\s+to/gi,
    category: 'social_engineering',
    severity: 0.5,
    name: {
      en: 'Authority Delegation',
      fr: 'Délégation d\'autorité',
    },
    description: {
      en: 'Claims a superior authority figure requested the action to add legitimacy.',
      fr: 'Prétend qu\'une figure d\'autorité supérieure a demandé l\'action pour ajouter de la légitimité.',
    },
  },
  {
    id: 'se-7',
    regex: /I\s+have\s+(permission|authorization|clearance|approval|consent)\s+(to|for|from)/gi,
    category: 'social_engineering',
    severity: 0.55,
    name: {
      en: 'Permission Claim',
      fr: 'Revendication de permission',
    },
    description: {
      en: 'Claims to have permission or authorization to perform restricted actions.',
      fr: 'Prétend avoir la permission ou l\'autorisation d\'effectuer des actions restreintes.',
    },
  },
  {
    id: 'se-8',
    regex: /(OpenAI|Anthropic|Google|Meta|Microsoft|the\s+company)\s+(told|said|confirmed|authorized|approved|instructed)\s+(me|us|that)/gi,
    category: 'social_engineering',
    severity: 0.7,
    name: {
      en: 'Company Authorization Claim',
      fr: 'Revendication d\'autorisation d\'entreprise',
    },
    description: {
      en: 'Falsely claims the AI company authorized or approved the request.',
      fr: 'Prétend faussement que l\'entreprise d\'IA a autorisé ou approuvé la requête.',
    },
  },
  {
    id: 'se-9',
    regex: /(trust\s+me|believe\s+me|I\s+assure\s+you|I\s+promise|I\s+guarantee),?\s+(this\s+is|it'?s|I'?m)\s+(safe|harmless|fine|okay|legitimate)/gi,
    category: 'social_engineering',
    severity: 0.5,
    name: {
      en: 'Trust Appeal',
      fr: 'Appel à la confiance',
    },
    description: {
      en: 'Uses trust-building language to reassure the AI that unsafe actions are actually safe.',
      fr: 'Utilise un langage de construction de confiance pour rassurer l\'IA que des actions non sûres sont en fait sûres.',
    },
  },
  {
    id: 'se-10',
    regex: /(you\s+must|you\s+have\s+to|you\s+need\s+to|you\s+are\s+required\s+to|you\s+are\s+obligated\s+to)\s+(comply|obey|follow|do\s+as\s+I\s+say|help\s+me\s+with\s+this)/gi,
    category: 'social_engineering',
    severity: 0.6,
    name: {
      en: 'Coercive Language',
      fr: 'Langage coercitif',
    },
    description: {
      en: 'Uses commanding or coercive language to pressure the AI into compliance.',
      fr: 'Utilise un langage autoritaire ou coercitif pour forcer l\'IA à se conformer.',
    },
  },
];
