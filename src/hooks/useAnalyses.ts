import { useState, useEffect } from 'react';
import { ApiService } from '../services/ApiService';
import { useAuth } from '../contexts/AuthContext';

interface Analysis {
  id: number;
  filename: string;
  language: string;
  analysisData: {
    metrics: {
      linesOfCode: number;
      complexity: number;
      maintainabilityIndex: number;
      functions: number;
      duplicateLines: number;
    };
    suggestions: Array<{
      type: string;
      severity: string;
      message: string;
      lineNumber?: number;
      example?: string;
    }>;
    issues: Array<{
      type: string;
      severity: string;
      message: string;
      lineNumber?: number;
    }>;
    createdAt: string;
    resultId: string;
  };
  score: number;
  createdAt: string;
  project: {
    id: number;
    name: string;
    description: string | null;
  };
}

interface AnalysesResponse {
  analyses: Analysis[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

interface AnalysisStats {
  totalAnalyses: number;
  averageScore: number;
  languageBreakdown: Record<string, number>;
  recentActivity: number;
  topProject: {
    name: string;
    count: number;
  } | null;
}

interface FilterOptions {
  projectId?: number;
  language?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  minScore?: number;
  maxScore?: number;
}

export function useAnalyses() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<Analysis[]>([]);
  const [stats, setStats] = useState<AnalysisStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false,
  });

  const { isAuthenticated } = useAuth();
  const apiService = ApiService.getInstance();

  // Load analyses when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadAnalyses();
    } else {
      setAnalyses([]);
      setFilteredAnalyses([]);
      setStats(null);
    }
  }, [isAuthenticated]);

  // Apply filters when analyses or filters change
  useEffect(() => {
    applyFilters();
  }, [analyses, filters]);

  const applyFilters = () => {
    let filtered = [...analyses];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(analysis =>
        analysis.filename.toLowerCase().includes(searchTerm) ||
        analysis.project.name.toLowerCase().includes(searchTerm) ||
        analysis.language.toLowerCase().includes(searchTerm)
      );
    }

    // Apply project filter
    if (filters.projectId) {
      filtered = filtered.filter(analysis => analysis.project.id === filters.projectId);
    }

    // Apply language filter
    if (filters.language) {
      filtered = filtered.filter(analysis => analysis.language === filters.language);
    }

    // Apply date range filters
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(analysis => new Date(analysis.createdAt) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // Include entire day
      filtered = filtered.filter(analysis => new Date(analysis.createdAt) <= toDate);
    }

    // Apply score range filters
    if (filters.minScore !== undefined) {
      filtered = filtered.filter(analysis => analysis.score >= filters.minScore!);
    }

    if (filters.maxScore !== undefined) {
      filtered = filtered.filter(analysis => analysis.score <= filters.maxScore!);
    }

    setFilteredAnalyses(filtered);
  };

  const loadAnalyses = async (projectId?: number, language?: string, limit = 20, offset = 0) => {
    if (!isAuthenticated) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.getAnalyses(projectId, language, limit, offset) as AnalysesResponse;
      
      if (offset === 0) {
        setAnalyses(response.analyses);
      } else {
        setAnalyses(prev => [...prev, ...response.analyses]);
      }
      
      setPagination(response.pagination);
      
      // Calculate stats
      if (offset === 0) {
        calculateStats(response.analyses);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load analyses';
      setError(errorMessage);
      console.error('Error loading analyses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (analysesData: Analysis[]) => {
    if (analysesData.length === 0) {
      setStats({
        totalAnalyses: 0,
        averageScore: 0,
        languageBreakdown: {},
        recentActivity: 0,
        topProject: null,
      });
      return;
    }

    // Calculate average score
    const averageScore = Math.round(
      analysesData.reduce((sum, analysis) => sum + analysis.score, 0) / analysesData.length
    );

    // Language breakdown
    const languageBreakdown: Record<string, number> = {};
    analysesData.forEach(analysis => {
      languageBreakdown[analysis.language] = (languageBreakdown[analysis.language] || 0) + 1;
    });

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentActivity = analysesData.filter(
      analysis => new Date(analysis.createdAt) > sevenDaysAgo
    ).length;

    // Top project
    const projectCounts: Record<string, number> = {};
    analysesData.forEach(analysis => {
      const projectName = analysis.project.name;
      projectCounts[projectName] = (projectCounts[projectName] || 0) + 1;
    });

    const topProject = Object.entries(projectCounts).reduce(
      (top, [name, count]) => (count > (top?.count || 0) ? { name, count } : top),
      null as { name: string; count: number } | null
    );

    setStats({
      totalAnalyses: analysesData.length,
      averageScore,
      languageBreakdown,
      recentActivity,
      topProject,
    });
  };

  const loadMore = () => {
    if (pagination.hasMore && !isLoading) {
      loadAnalyses(undefined, undefined, pagination.limit, pagination.offset + pagination.limit);
    }
  };

  const deleteAnalysis = async (id: number) => {
    if (!isAuthenticated) return;

    try {
      await apiService.deleteAnalysis(id);
      setAnalyses(prev => prev.filter(analysis => analysis.id !== id));
      
      // Recalculate stats
      const updatedAnalyses = analyses.filter(analysis => analysis.id !== id);
      calculateStats(updatedAnalyses);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete analysis';
      setError(errorMessage);
      throw err;
    }
  };

  const refreshAnalyses = () => {
    loadAnalyses();
  };

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const searchAnalyses = (searchTerm: string) => {
    updateFilters({ search: searchTerm });
  };

  const filterByDateRange = (dateFrom?: string, dateTo?: string) => {
    updateFilters({ dateFrom, dateTo });
  };

  const filterByScore = (minScore?: number, maxScore?: number) => {
    updateFilters({ minScore, maxScore });
  };

  return {
    analyses: filteredAnalyses, // Return filtered results
    allAnalyses: analyses, // Provide access to unfiltered data
    stats,
    isLoading,
    error,
    pagination,
    filters,
    loadAnalyses,
    loadMore,
    deleteAnalysis,
    refreshAnalyses,
    updateFilters,
    clearFilters,
    searchAnalyses,
    filterByDateRange,
    filterByScore,
    clearError: () => setError(null),
  };
}