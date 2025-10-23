'use client';

import React from 'react';
import { Search, Filter, Zap, Sparkles } from 'lucide-react';

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterType: 'all' | 'processing' | 'scifi';
  onFilterChange: (type: 'all' | 'processing' | 'scifi') => void;
  sessionCounts: {
    total: number;
    processing: number;
    scifi: number;
  };
  filteredCount: number;
  userEmail?: string;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange,
  sessionCounts,
  filteredCount,
  userEmail
}) => {
  return (
    <div className="mb-6 sm:mb-8 glass-effect p-4 sm:p-6 rounded-lg border border-primary/30 hindu-pattern">
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary" />
          <input
            type="text"
            placeholder="Search artifacts..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-dark-lighter border-2 border-primary/30 rounded-lg focus:border-primary focus:outline-none transition-all text-sm sm:text-base"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-3 sm:px-4 py-2 rounded-lg border-2 transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
              filterType === 'all' 
                ? 'bg-primary border-primary text-dark' 
                : 'border-primary/30 hover:border-primary'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden xs:inline">All</span> ({sessionCounts.total})
          </button>
          
          <button
            onClick={() => onFilterChange('processing')}
            className={`px-3 sm:px-4 py-2 rounded-lg border-2 transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
              filterType === 'processing' 
                ? 'bg-primary border-primary text-dark' 
                : 'border-primary/30 hover:border-primary'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span className="hidden xs:inline">AI Lab</span> ({sessionCounts.processing})
          </button>
          
          <button
            onClick={() => onFilterChange('scifi')}
            className={`px-3 sm:px-4 py-2 rounded-lg border-2 transition-all flex items-center justify-center gap-2 text-sm sm:text-base ${
              filterType === 'scifi' 
                ? 'bg-purple-500 border-purple-500 text-white' 
                : 'border-purple-500/30 hover:border-purple-500 text-purple-300'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden xs:inline">Sci-Fi</span> ({sessionCounts.scifi})
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm text-wheat/60">
        <span>Showing {filteredCount} of {sessionCounts.total} sessions</span>
        <span className="truncate">User: {userEmail || 'Unknown'}</span>
      </div>
    </div>
  );
};

export default SearchAndFilter;