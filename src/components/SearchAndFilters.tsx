import { useState } from 'react';
import { Search, Filter, Calendar, BarChart, X, Sliders } from 'lucide-react';

interface Project {
  id: number;
  name: string;
}

interface SearchAndFiltersProps {
  projects: Project[];
  languages: string[];
  filters: {
    search?: string;
    projectId?: number;
    language?: string;
    dateFrom?: string;
    dateTo?: string;
    minScore?: number;
    maxScore?: number;
  };
  onUpdateFilters: (filters: any) => void;
  onClearFilters: () => void;
  resultsCount: number;
  totalCount: number;
}

export function SearchAndFilters({
  projects,
  languages,
  filters,
  onUpdateFilters,
  onClearFilters,
  resultsCount,
  totalCount,
}: SearchAndFiltersProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search || '');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFilters({ search: searchInput.trim() || undefined });
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    // Real-time search with debouncing
    if (value.trim() === '') {
      onUpdateFilters({ search: undefined });
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    onUpdateFilters({ search: undefined });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== undefined && value !== '' && value !== null
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by filename, project, or language..."
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {/* Quick Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center">
          <Filter className="w-4 h-4 mr-2 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Quick Filters:</span>
        </div>
        
        <select
          value={filters.projectId || ''}
          onChange={(e) => onUpdateFilters({ projectId: e.target.value ? Number(e.target.value) : undefined })}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Projects</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>

        <select
          value={filters.language || ''}
          onChange={(e) => onUpdateFilters({ language: e.target.value || undefined })}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Languages</option>
          {languages.map(language => (
            <option key={language} value={language}>
              {language.charAt(0).toUpperCase() + language.slice(1)}
            </option>
          ))}
        </select>

        <button
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className={`flex items-center px-3 py-2 border rounded-lg text-sm transition-colors ${
            showAdvancedFilters ? 'bg-blue-100 text-blue-700 border-blue-300' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Sliders className="w-4 h-4 mr-2" />
          Advanced
        </button>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center px-3 py-2 text-red-600 hover:text-red-700 text-sm transition-colors"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="border-t border-gray-200 pt-4 space-y-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Advanced Filters</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={filters.dateFrom || ''}
                  onChange={(e) => onUpdateFilters({ dateFrom: e.target.value || undefined })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="From"
                />
                <input
                  type="date"
                  value={filters.dateTo || ''}
                  onChange={(e) => onUpdateFilters({ dateTo: e.target.value || undefined })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="To"
                />
              </div>
            </div>

            {/* Score Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BarChart className="w-4 h-4 inline mr-1" />
                Score Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.minScore || ''}
                  onChange={(e) => onUpdateFilters({ minScore: e.target.value ? Number(e.target.value) : undefined })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Min"
                />
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.maxScore || ''}
                  onChange={(e) => onUpdateFilters({ maxScore: e.target.value ? Number(e.target.value) : undefined })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Max"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            {hasActiveFilters ? (
              <>
                Showing <span className="font-semibold text-gray-900">{resultsCount}</span> of{' '}
                <span className="font-semibold text-gray-900">{totalCount}</span> analyses
                {filters.search && (
                  <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    "{filters.search}"
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="font-semibold text-gray-900">{totalCount}</span> total analyses
              </>
            )}
          </div>
          
          {hasActiveFilters && (
            <div className="flex items-center space-x-2">
              {filters.projectId && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                  Project: {projects.find(p => p.id === filters.projectId)?.name}
                </span>
              )}
              {filters.language && (
                <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                  {filters.language}
                </span>
              )}
              {(filters.dateFrom || filters.dateTo) && (
                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                  Date Range
                </span>
              )}
              {(filters.minScore !== undefined || filters.maxScore !== undefined) && (
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                  Score: {filters.minScore || 0}-{filters.maxScore || 100}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}