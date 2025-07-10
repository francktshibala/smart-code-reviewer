# Smart Code Reviewer - Complete Setup Guide

## Quick Start (5 Minutes)

### 1. Create New Vite + TypeScript Project
```bash
# Create project
npm create vite@latest smart-code-reviewer -- --template react-ts
cd smart-code-reviewer

# Install dependencies
npm install

# Add additional packages
npm install lucide-react clsx tailwind-merge
npm install -D tailwindcss postcss autoprefixer @types/node
```

### 2. Setup Tailwind CSS
```bash
# Initialize Tailwind
npx tailwindcss init -p
```

**Configure `tailwind.config.js`:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**Update `src/index.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3. Project Structure
Create this folder structure:
```
src/
├── components/
│   ├── FileUploadZone.tsx
│   ├── AnalysisResults.tsx
│   └── LoadingSpinner.tsx
├── services/
│   ├── CodeAnalysisService.ts
│   └── types.ts
├── utils/
│   ├── fileHandlers.ts
│   └── languageDetection.ts
├── App.tsx
├── main.tsx
└── index.css
```

### 4. TypeScript Configuration
**Update `tsconfig.json`:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### 5. Core Type Definitions

**Create `src/services/types.ts`:**
```typescript
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
```

### 6. Analysis Service Implementation

**Create `src/services/CodeAnalysisService.ts`:**
```typescript
import { CodeFile, AnalysisResult, CodeMetrics, AISuggestion, CodeIssue } from './types';

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
```

### 7. Utility Functions

**Create `src/utils/languageDetection.ts`:**
```typescript
import { SupportedLanguage, FileExtension, LanguageMap } from '../services/types';

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
```

### 8. Update Main App

**Replace `src/App.tsx` with the complete Smart Code Reviewer component from the first artifact.**

### 9. Final Package.json Scripts

**Update `package.json` scripts:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "type-check": "tsc --noEmit"
  }
}
```

### 10. Environment Setup

**Create `.env` file:**
```env
VITE_APP_NAME=Smart Code Reviewer
VITE_VERSION=1.0.0
```

## Development Workflow

### Daily Development Commands
```bash
# Start development server
npm run dev

# Check TypeScript types
npm run type-check

# Run linting
npm run lint

# Build for production
npm run build
```

### Git Setup
```bash
# Initialize repository
git init
git add .
git commit -m "Initial commit: Smart Code Reviewer TypeScript project"

# Connect to GitHub
git remote add origin https://github.com/your-username/smart-code-reviewer.git
git push -u origin main
```

## Video Recording Checklist

### Before Recording:
- [ ] Test app with multiple file types
- [ ] Prepare 2-3 sample code files with different complexity levels
- [ ] Practice explanation of key TypeScript features
- [ ] Set up good lighting and audio
- [ ] Close unnecessary applications

### Video Structure (4-5 minutes):
1. **Introduction (30s)**: Problem statement and solution overview
2. **Live Demo (2m)**: Upload files, show analysis, export report
3. **Code Walkthrough (2m)**: TypeScript features, architecture, key learnings
4. **Conclusion (30s)**: Challenges overcome and future improvements

### After Recording:
- [ ] Upload to YouTube/Vimeo as unlisted
- [ ] Test video link works
- [ ] Add link to README.md
- [ ] Include link in submission document

## Submission Checklist

### Code Quality:
- [ ] All TypeScript compilation passes with zero errors
- [ ] ESLint passes with no warnings
- [ ] All functions have useful comments
- [ ] Professional code organization and naming

### Documentation:
- [ ] README.md completely filled out
- [ ] All links work correctly
- [ ] Professional writing with no spelling errors
- [ ] Clear installation and usage instructions

### Repository:
- [ ] Public repository with descriptive name
- [ ] Clean git history with meaningful commit messages
- [ ] Professional repository description
- [ ] All files properly organized

### Video:
- [ ] 4-5 minutes total length
- [ ] Face visible during presentation
- [ ] Clear audio and video quality
- [ ] Demonstrates all key features
- [ ] Explains TypeScript concepts clearly

This setup guide will help you create a professional, impressive TypeScript project that demonstrates advanced skills while being genuinely useful. The key is to focus on TypeScript's strengths: type safety, developer experience, and maintainable architecture.