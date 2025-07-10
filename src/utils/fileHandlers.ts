import type { CodeFile } from '../services/types';
import { detectLanguage } from './languageDetection';

export function createCodeFile(file: File): Promise<CodeFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const codeFile: CodeFile = {
          name: file.name,
          content,
          language: detectLanguage(file.name),
          size: file.size,
          lastModified: new Date(file.lastModified)
        };
        resolve(codeFile);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function validateFile(file: File): boolean {
  const maxSize = 1024 * 1024; // 1MB
  const allowedExtensions = ['.ts', '.js', '.py', '.java', '.go', '.rs'];
  
  if (file.size > maxSize) {
    throw new Error('File size exceeds 1MB limit');
  }
  
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    throw new Error(`Unsupported file type: ${extension}`);
  }
  
  return true;
}