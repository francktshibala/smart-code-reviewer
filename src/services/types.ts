export interface CodeFile {
  name: string;
  content: string;
  language: SupportedLanguage;
  size: number;
  lastModified: Date;
}

export interface AnalysisResult {
  id: string;
  fileName: string;
  metrics: CodeMetrics;
  suggestions: AISuggestion[];
  issues: CodeIssue[];
  score: number;
  createdAt: Date;
}

export interface CodeMetrics {
  linesOfCode: number;
  complexity: number;
  maintainabilityIndex: number;
  functions: number;
  duplicateLines: number;
}

export interface AISuggestion {
  type: 'improvement' | 'refactor' | 'security' | 'performance';
  severity: 'low' | 'medium' | 'high';
  message: string;
  lineNumber?: number;
  example?: string;
}

export interface CodeIssue {
  type: 'syntax' | 'complexity' | 'style' | 'security';
  severity: 'low' | 'medium' | 'high';
  message: string;
  lineNumber?: number;
}

export type SupportedLanguage = 'typescript' | 'javascript' | 'python' | 'java' | 'go' | 'rust';

export type FileExtension = '.ts' | '.js' | '.py' | '.java' | '.go' | '.rs';

export type LanguageMap = Record<FileExtension, SupportedLanguage>;