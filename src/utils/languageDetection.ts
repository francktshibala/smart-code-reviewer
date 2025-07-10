import type { SupportedLanguage, FileExtension, LanguageMap } from '../services/types';

export const LANGUAGE_MAP: LanguageMap = {
  '.ts': 'typescript',
  '.js': 'javascript',
  '.py': 'python',
  '.java': 'java',
  '.go': 'go',
  '.rs': 'rust'
};

export function detectLanguage(fileName: string): SupportedLanguage {
  const extension = ('.' + fileName.split('.').pop()?.toLowerCase()) as FileExtension;
  return LANGUAGE_MAP[extension] || 'javascript';
}

export function getLanguageIcon(language: SupportedLanguage): string {
  const icons = {
    typescript: '📘',
    javascript: '📙',
    python: '🐍',
    java: '☕',
    go: '🐹',
    rust: '🦀'
  };
  return icons[language] || '📄';
}

export function getFileExtensions(): string[] {
  return Object.keys(LANGUAGE_MAP);
}