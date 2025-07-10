import type { CodeFile, AnalysisResult, CodeMetrics, AISuggestion, CodeIssue } from './types';

export class CodeAnalysisService {
  private static instance: CodeAnalysisService;
  
  public static getInstance(): CodeAnalysisService {
    if (!CodeAnalysisService.instance) {
      CodeAnalysisService.instance = new CodeAnalysisService();
    }
    return CodeAnalysisService.instance;
  }

  async analyzeCode(file: CodeFile): Promise<AnalysisResult> {
    // Simulate API delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const metrics = this.calculateMetrics(file);
    const suggestions = this.generateSuggestions(file, metrics);
    const issues = this.detectIssues(file, metrics);
    const score = this.calculateScore(metrics, suggestions, issues);

    return {
      id: this.generateId(),
      fileName: file.name,
      metrics,
      suggestions,
      issues,
      score,
      createdAt: new Date()
    };
  }

  private calculateMetrics(file: CodeFile): CodeMetrics {
    const lines = file.content.split('\n');
    const linesOfCode = lines.filter(line => 
      line.trim() && 
      !line.trim().startsWith('//') && 
      !line.trim().startsWith('/*') &&
      !line.trim().startsWith('*')
    ).length;
    
    // Calculate cyclomatic complexity
    const complexityPatterns = /if|else|while|for|switch|case|catch|&&|\|\||\?/g;
    const complexity = (file.content.match(complexityPatterns) || []).length + 1;
    
    // Count functions
    const functionPatterns = /function|const.*=.*=>|class.*{|def |func /g;
    const functions = (file.content.match(functionPatterns) || []).length;
    
    // Calculate maintainability index (Microsoft formula adapted)
    const volume = linesOfCode * Math.log2(functions + 1);
    const maintainabilityIndex = Math.max(0, 
      171 - 5.2 * Math.log(volume) - 0.23 * complexity - 16.2 * Math.log(functions || 1)
    );
    
    // Simple duplicate detection
    const duplicateLines = this.detectDuplicateLines(lines);

    return {
      linesOfCode,
      complexity,
      maintainabilityIndex: Math.round(maintainabilityIndex),
      functions,
      duplicateLines
    };
  }

  private detectDuplicateLines(lines: string[]): number {
    const nonEmptyLines = lines
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('//'));
    
    const lineCount = new Map<string, number>();
    nonEmptyLines.forEach(line => {
      lineCount.set(line, (lineCount.get(line) || 0) + 1);
    });
    
    return Array.from(lineCount.values())
      .filter(count => count > 1)
      .reduce((acc, count) => acc + count - 1, 0);
  }

  private generateSuggestions(file: CodeFile, metrics: CodeMetrics): AISuggestion[] {
    const suggestions: AISuggestion[] = [];

    // Complexity suggestions
    if (metrics.complexity > 10) {
      suggestions.push({
        type: 'refactor',
        severity: metrics.complexity > 20 ? 'high' : 'medium',
        message: `High cyclomatic complexity (${metrics.complexity}). Consider breaking down complex functions into smaller, more manageable pieces.`,
        example: 'Extract complex logic into separate functions with single responsibilities.'
      });
    }

    // File size suggestions
    if (metrics.linesOfCode > 300) {
      suggestions.push({
        type: 'refactor',
        severity: 'medium',
        message: `Large file detected (${metrics.linesOfCode} lines). Consider splitting into multiple modules for better maintainability.`,
        example: 'Separate concerns into different files (e.g., utils.ts, types.ts, main.ts)'
      });
    }

    // Language-specific suggestions
    if (file.language === 'javascript' && !file.content.includes('strict')) {
      suggestions.push({
        type: 'improvement',
        severity: 'medium',
        message: 'Consider enabling strict mode for better error handling and performance.',
        lineNumber: 1,
        example: '"use strict"; at the top of your file'
      });
    }

    if (file.language === 'typescript') {
      if (!file.content.includes('interface') && !file.content.includes('type') && metrics.linesOfCode > 50) {
        suggestions.push({
          type: 'improvement',
          severity: 'low',
          message: 'Consider adding TypeScript interfaces or types for better type safety.',
          example: 'interface User { id: string; name: string; email: string; }'
        });
      }
    }

    // Duplicate code suggestions
    if (metrics.duplicateLines > 5) {
      suggestions.push({
        type: 'refactor',
        severity: 'medium',
        message: `Code duplication detected (${metrics.duplicateLines} duplicate lines). Consider extracting common code into reusable functions.`,
        example: 'Create utility functions for repeated logic patterns.'
      });
    }

    // Performance suggestions
    if (file.content.includes('console.log') && file.language !== 'python') {
      suggestions.push({
        type: 'performance',
        severity: 'low',
        message: 'Remove console.log statements in production code for better performance.',
        example: 'Use a logging library or conditional logging for development.'
      });
    }

    return suggestions;
  }

  private detectIssues(file: CodeFile, metrics: CodeMetrics): CodeIssue[] {
    const issues: CodeIssue[] = [];

    // Security issues
    if (file.content.includes('eval(') || file.content.includes('innerHTML')) {
      issues.push({
        type: 'security',
        severity: 'high',
        message: 'Potential security vulnerability detected. Avoid using eval() or innerHTML with user input.',
        lineNumber: this.findLineNumber(file.content, /eval\(|innerHTML/)
      });
    }

    // Complexity issues
    if (metrics.complexity > 20) {
      issues.push({
        type: 'complexity',
        severity: 'high',
        message: 'Extremely high complexity detected - immediate refactoring recommended.',
        lineNumber: 1
      });
    }

    // Style issues
    if (metrics.duplicateLines > 15) {
      issues.push({
        type: 'style',
        severity: 'medium',
        message: 'Significant code duplication detected - refactoring needed.',
      });
    }

    // Language-specific issues
    if (file.language === 'javascript' && file.content.includes('var ')) {
      issues.push({
        type: 'style',
        severity: 'low',
        message: 'Use let or const instead of var for better scoping.',
        lineNumber: this.findLineNumber(file.content, /var /)
      });
    }

    return issues;
  }

  private findLineNumber(content: string, pattern: RegExp): number | undefined {
    const lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (pattern.test(lines[i])) {
        return i + 1;
      }
    }
    return undefined;
  }

  private calculateScore(metrics: CodeMetrics, suggestions: AISuggestion[], issues: CodeIssue[]): number {
    let score = 100;
    
    // Deduct points for complexity
    score -= Math.min(metrics.complexity * 1.5, 25);
    
    // Deduct points for suggestions
    score -= suggestions.reduce((acc, suggestion) => {
      return acc + (suggestion.severity === 'high' ? 8 : suggestion.severity === 'medium' ? 5 : 3);
    }, 0);
    
    // Deduct points for issues
    score -= issues.reduce((acc, issue) => {
      return acc + (issue.severity === 'high' ? 15 : issue.severity === 'medium' ? 10 : 5);
    }, 0);
    
    // Bonus for good maintainability
    if (metrics.maintainabilityIndex > 80) score += 5;
    if (metrics.maintainabilityIndex > 90) score += 5;
    
    // Bonus for good function count
    if (metrics.functions > 0 && metrics.linesOfCode / metrics.functions < 20) score += 5;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  private generateId(): string {
    return `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}