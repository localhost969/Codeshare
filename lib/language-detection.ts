/**
 * Language detection utility for code snippets
 * Detects programming language based on syntax patterns
 */

interface LanguagePattern {
  name: string;
  ext: string;
  patterns: RegExp[];
  priority: number; // Higher priority = checked first
}

const LANGUAGE_PATTERNS: LanguagePattern[] = [
  {
    name: 'JavaScript',
    ext: 'js',
    patterns: [
      /(?:const|let|var|function|async|await|import|export|=>|require)\s/,
      /console\.(log|error|warn|info)/,
      /document\.|window\.|fetch\(/,
    ],
    priority: 90,
  },
  {
    name: 'TypeScript',
    ext: 'ts',
    patterns: [
      /:\s*(?:string|number|boolean|any|void|interface|type|enum|as|namespace)/,
      /(?:interface|type|enum|namespace|generics)\s+\w+/,
      /export\s+(?:interface|type|class|enum)/,
    ],
    priority: 95,
  },
  {
    name: 'Python',
    ext: 'py',
    patterns: [
      /^(?:import|from)\s+\w+/m,
      /def\s+\w+\s*\(/,
      /^\s{4,}(?=\w)/m, // Indentation-based
      /print\s*\(/,
      /if\s+__name__\s*==\s*['"]__main__['"]/,
    ],
    priority: 90,
  },
  {
    name: 'Java',
    ext: 'java',
    patterns: [
      /public\s+(?:class|interface|enum)\s+\w+/,
      /import\s+java\./,
      /public\s+static\s+void\s+main/,
      /new\s+\w+\s*\(/,
    ],
    priority: 85,
  },
  {
    name: 'C++',
    ext: 'cpp',
    patterns: [
      /#include\s+[<"]/,
      /std::/,
      /(?:int|void|char|double|float)\s+\w+\s*\(/,
      /using\s+namespace/,
    ],
    priority: 85,
  },
  {
    name: 'C',
    ext: 'c',
    patterns: [
      /#include\s+[<"]/,
      /int\s+main\s*\(/,
      /(?:int|void|char|float)\s+\w+\s*[;=\(]/,
    ],
    priority: 80,
  },
  {
    name: 'Go',
    ext: 'go',
    patterns: [
      /package\s+\w+/,
      /import\s+\(/,
      /func\s+\w+\s*\(/,
      /defer\s+/,
    ],
    priority: 88,
  },
  {
    name: 'Rust',
    ext: 'rs',
    patterns: [
      /fn\s+\w+\s*\(/,
      /let\s+\w+\s*=/,
      /impl\s+\w+/,
      /pub\s+(?:fn|struct|enum|trait)/,
      /cargo\./,
    ],
    priority: 88,
  },
  {
    name: 'PHP',
    ext: 'php',
    patterns: [
      /<\?php/,
      /\$\w+\s*=/,
      /echo\s+|print\s+/,
      /function\s+\w+\s*\(/,
    ],
    priority: 85,
  },
  {
    name: 'Ruby',
    ext: 'rb',
    patterns: [
      /def\s+\w+/,
      /require\s+/,
      /puts\s+|print\s+/,
      /@\w+|@@\w+/,
    ],
    priority: 85,
  },
  {
    name: 'HTML',
    ext: 'html',
    patterns: [
      /<!DOCTYPE|<html|<head|<body|<div|<span|<p>/i,
      /<\/\w+>/,
    ],
    priority: 75,
  },
  {
    name: 'CSS',
    ext: 'css',
    patterns: [
      /[\w-]+\s*:\s*[^;]+;/,
      /^[\w.-]+\s*\{/m,
      /(@media|@keyframes|@import)/,
    ],
    priority: 70,
  },
  {
    name: 'SQL',
    ext: 'sql',
    patterns: [
      /(?:SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER)\s+/i,
      /FROM\s+\w+/i,
      /WHERE\s+/i,
    ],
    priority: 85,
  },
  {
    name: 'JSON',
    ext: 'json',
    patterns: [/^\s*[\{\[]\s*$|^\s*"[\w-]+"\s*:\s*/m],
    priority: 80,
  },
  {
    name: 'YAML',
    ext: 'yaml',
    patterns: [/^[\w-]+:\s*[\w\d-]+/m, /^-\s+/m],
    priority: 75,
  },
  {
    name: 'Bash',
    ext: 'bash',
    patterns: [/^#!/, /echo\s+|if\s+\[\s|for\s+\w+\s+in/m],
    priority: 80,
  },
  {
    name: 'Markdown',
    ext: 'md',
    patterns: [/^#{1,6}\s+/m, /^\s*[-*]\s+/m, /\[.*\]\(.*\)/],
    priority: 70,
  },
  {
    name: 'XML',
    ext: 'xml',
    patterns: [/^<\?xml|<\w+[^>]*>/],
    priority: 75,
  },
  {
    name: 'Kotlin',
    ext: 'kt',
    patterns: [
      /fun\s+\w+\s*\(/,
      /val\s+\w+\s*:/,
      /class\s+\w+/,
      /package\s+\w+/,
    ],
    priority: 82,
  },
  {
    name: 'Swift',
    ext: 'swift',
    patterns: [
      /func\s+\w+\s*\(/,
      /let\s+\w+\s*:/,
      /var\s+\w+\s*:/,
      /class\s+\w+/,
    ],
    priority: 82,
  },
];

/**
 * Detect programming language from code
 * @param code - The code content to analyze
 * @returns Object with detected language name, extension, and confidence
 */
export function detectLanguage(code: string): {
  language: string;
  extension: string;
  confidence: number;
} {
  if (!code || code.trim().length === 0) {
    return {
      language: 'Text',
      extension: 'txt',
      confidence: 0,
    };
  }

  // Normalize code for analysis
  const normalizedCode = code.substring(0, 1000); // Analyze first 1000 chars for performance

  // Score each language
  const scores = LANGUAGE_PATTERNS.map((lang) => {
    let score = 0;

    for (const pattern of lang.patterns) {
      if (pattern.test(normalizedCode)) {
        score += 25; // Each pattern match = 25 points
      }
    }

    return {
      language: lang.name,
      extension: lang.ext,
      score: score * lang.priority, // Weight by priority
    };
  });

  // Sort by score
  scores.sort((a, b) => b.score - a.score);

  const topMatch = scores[0];

  // If score is too low, default to text
  if (topMatch.score < 25) {
    return {
      language: 'Text',
      extension: 'txt',
      confidence: 0,
    };
  }

  // Calculate confidence (0-100)
  const confidence = Math.min(100, Math.round((topMatch.score / 10000) * 100));

  return {
    language: topMatch.language,
    extension: topMatch.extension,
    confidence,
  };
}

/**
 * Get all supported languages
 */
export function getSupportedLanguages(): Array<{ name: string; extension: string }> {
  return LANGUAGE_PATTERNS.map((lang) => ({
    name: lang.name,
    extension: lang.ext,
  }));
}

/**
 * Validate language extension
 */
export function isValidLanguage(extension: string): boolean {
  return LANGUAGE_PATTERNS.some((lang) => lang.ext === extension.toLowerCase());
}

/**
 * Get language name from extension
 */
export function getLanguageFromExtension(extension: string): string | null {
  const lang = LANGUAGE_PATTERNS.find((l) => l.ext === extension.toLowerCase());
  return lang ? lang.name : null;
}
