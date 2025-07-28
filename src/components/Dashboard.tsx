import { useState, useCallback } from 'react';
import { 
  BarChart3, 
  Calendar, 
  Code, 
  FileText, 
  Folder, 
  TrendingUp, 
  Trash2,
  Eye,
  RefreshCw
} from 'lucide-react';
import { useAnalyses, type Analysis } from '../hooks/useAnalyses';
import { useProjects } from '../hooks/useProjects';
import { SearchAndFilters } from './SearchAndFilters';
import { AnalysisViewer } from './AnalysisViewer';

export function Dashboard() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const [showViewer, setShowViewer] = useState(false);

  const { 
    analyses, 
    allAnalyses,
    stats, 
    isLoading, 
    error, 
    pagination,
    filters,
    loadMore, 
    deleteAnalysis,
    refreshAnalyses,
    updateFilters,
    clearFilters,
    clearError 
  } = useAnalyses();
  
  const { projects } = useProjects();

  const handleViewAnalysis = useCallback((analysis: Analysis) => {
    console.log('handleViewAnalysis called with:', analysis.id);
    setSelectedAnalysis(analysis);
    setShowViewer(true);
    console.log('State should be updated - showViewer: true, selectedAnalysis:', analysis.id);
  }, []);

  const handleCloseViewer = useCallback(() => {
    setShowViewer(false);
    setSelectedAnalysis(null);
  }, []);

  // Get unique languages from all analyses
  const availableLanguages = Array.from(
    new Set(allAnalyses.map(analysis => analysis.language))
  ).sort();

  const handleDeleteAnalysis = async (id: number, filename: string) => {
    if (confirm(`Are you sure you want to delete the analysis for "${filename}"?`)) {
      try {
        await deleteAnalysis(id);
      } catch (error) {
        console.error('Failed to delete analysis:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-700 bg-red-100';
      case 'medium': return 'text-yellow-700 bg-yellow-100';
      case 'low': return 'text-green-700 bg-green-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analysis Dashboard</h1>
          <p className="text-gray-600">Track your code analysis history and insights</p>
        </div>
        <button
          onClick={refreshAnalyses}
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <p className="text-red-700">{error}</p>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Analyses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAnalyses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageScore}/100</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent Activity</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recentActivity}</p>
                <p className="text-xs text-gray-500">Last 7 days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Folder className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Top Project</p>
                <p className="text-lg font-bold text-gray-900">
                  {stats.topProject?.name || 'None'}
                </p>
                {stats.topProject && (
                  <p className="text-xs text-gray-500">{stats.topProject.count} analyses</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Language Breakdown */}
      {stats && Object.keys(stats.languageBreakdown).length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Language Breakdown
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.languageBreakdown).map(([language, count]) => (
              <div key={language} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className="text-sm text-gray-600 capitalize">{language}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <SearchAndFilters
        projects={projects}
        languages={availableLanguages}
        filters={filters}
        onUpdateFilters={updateFilters}
        onClearFilters={clearFilters}
        resultsCount={analyses.length}
        totalCount={allAnalyses.length}
      />

      {/* View Mode Toggle */}
      <div className="flex justify-end mb-6">
        <div className="flex items-center">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-l-lg border ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600 border-blue-300' : 'bg-white text-gray-600 border-gray-300'}`}
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-r-lg border-t border-r border-b ${viewMode === 'list' ? 'bg-blue-100 text-blue-600 border-blue-300' : 'bg-white text-gray-600 border-gray-300'}`}
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Analyses List */}
      {isLoading && analyses.length === 0 ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your analyses...</p>
        </div>
      ) : analyses.length === 0 ? (
        <div className="text-center py-12">
          <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No analyses found</h3>
          <p className="text-gray-600">Start by analyzing some code files to see them here.</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {analyses.map((analysis) => (
            <div
              key={analysis.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {analysis.filename}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {analysis.project.name} • {analysis.language}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(analysis.createdAt)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(analysis.score)}`}>
                    {analysis.score}/100
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-bold text-gray-900">
                    {analysis.analysisData.metrics.linesOfCode}
                  </div>
                  <div className="text-xs text-gray-600">Lines</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-bold text-gray-900">
                    {analysis.analysisData.issues.length}
                  </div>
                  <div className="text-xs text-gray-600">Issues</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  {analysis.analysisData.issues.slice(0, 3).map((issue, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded text-xs ${getSeverityColor(issue.severity)}`}
                    >
                      {issue.severity}
                    </span>
                  ))}
                  {analysis.analysisData.issues.length > 3 && (
                    <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                      +{analysis.analysisData.issues.length - 3}
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewAnalysis(analysis)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAnalysis(analysis.id, analysis.filename)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete Analysis"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {pagination.hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {/* Analysis Viewer Modal */}
      <AnalysisViewer
        analysis={selectedAnalysis}
        isOpen={showViewer}
        onClose={handleCloseViewer}
      />
    </div>
  );
}