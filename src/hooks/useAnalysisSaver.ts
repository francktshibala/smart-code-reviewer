import { useState } from 'react';
import { ApiService } from '../services/ApiService';
import { useAuth } from '../contexts/AuthContext';
import type { AnalysisResult, CodeFile } from '../services/types';

interface SavedAnalysis {
  id: number;
  filename: string;
  language: string;
  analysisData: any;
  score: number;
  createdAt: string;
  project: {
    id: number;
    name: string;
    description: string | null;
  };
}

export function useAnalysisSaver() {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [lastSavedAnalysis, setLastSavedAnalysis] = useState<SavedAnalysis | null>(null);

  const { isAuthenticated } = useAuth();
  const apiService = ApiService.getInstance();

  const saveAnalysis = async (
    result: AnalysisResult,
    file: CodeFile,
    projectId: number
  ): Promise<SavedAnalysis | null> => {
    if (!isAuthenticated) {
      setSaveError('You must be logged in to save analyses');
      return null;
    }

    if (!projectId) {
      setSaveError('No project selected for saving');
      return null;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      // Transform the analysis result to match backend expected format
      const analysisData = {
        metrics: result.metrics,
        suggestions: result.suggestions,
        issues: result.issues,
        createdAt: result.createdAt.toISOString(),
        resultId: result.id,
      };

      const response = await apiService.saveAnalysis(
        projectId,
        result.fileName,
        file.language,
        analysisData,
        result.score
      ) as { analysis: SavedAnalysis };

      const savedAnalysis = response.analysis;
      setLastSavedAnalysis(savedAnalysis);
      
      return savedAnalysis;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save analysis';
      setSaveError(errorMessage);
      console.error('Error saving analysis:', err);
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  const clearSaveError = () => setSaveError(null);
  const clearLastSaved = () => setLastSavedAnalysis(null);

  return {
    saveAnalysis,
    isSaving,
    saveError,
    lastSavedAnalysis,
    clearSaveError,
    clearLastSaved,
  };
}