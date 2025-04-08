import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { searchTags } from '../../services/api';

// Import our refactored components
import SearchBar from './SearchBar';
import RefineFilters from './RefineFilters';
import SearchResults from './SearchResults';
import EmptySearchState from './EmptySearchState';

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    searchState,
    updateSearch,
    uiState,
    setLoading,
    setError,
    clearError
  } = useAppContext();

  // Local state for current search query and results
  const [searchQuery, setSearchQuery] = useState(searchState.query || '');
  const [searchResults, setSearchResults] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    khandaId: searchState.filters.khandaId || null,
    adhyayaId: searchState.filters.adhyayaId || null,
    mainTopic: searchState.filters.mainTopic || null,
    contextSize: 100, // Fixed context size
    limit: searchState.filters.limit || 20,
    skip: searchState.filters.skip || 0
  });

  // Extract search params from URL on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    const khandaId = params.get('khanda');
    const adhyayaId = params.get('adhyaya');
    const mainTopic = params.get('topic');

    // If we have params, update search state
    if (query) {
      setSearchQuery(query);
      setSearchFilters(prev => ({
        ...prev,
        khandaId: khandaId ? parseInt(khandaId, 10) : null,
        adhyayaId: adhyayaId ? parseInt(adhyayaId, 10) : null,
        mainTopic: mainTopic || null,
        skip: 0 // Reset pagination
      }));

      // Perform search with URL params
      performSearch(query, {
        khandaId: khandaId ? parseInt(khandaId, 10) : null,
        adhyayaId: adhyayaId ? parseInt(adhyayaId, 10) : null,
        mainTopic: mainTopic || null,
        contextSize: 100, // Fixed context size
        limit: searchFilters.limit,
        skip: 0
      });
    } else if (searchState.query) {
      // If no URL params but we have state from context, use that
      setSearchQuery(searchState.query);
      performSearch(searchState.query, searchFilters);
    }
  }, [location.search]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update URL with search params when they change
  useEffect(() => {
    if (searchQuery) {
      const params = new URLSearchParams();
      params.set('q', searchQuery);

      if (searchFilters.khandaId) {
        params.set('khanda', searchFilters.khandaId.toString());
      }

      if (searchFilters.adhyayaId) {
        params.set('adhyaya', searchFilters.adhyayaId.toString());
      }

      if (searchFilters.mainTopic) {
        params.set('topic', searchFilters.mainTopic);
      }

      // Update URL without triggering page reload
      navigate(`/search?${params.toString()}`, { replace: true });
    }
  }, [searchQuery, searchFilters, navigate]);

  // Perform search with given query and filters
  const performSearch = async (query, filters) => {
    if (!query || query.trim() === '') return;

    // Log for debugging
    setLoading(true);
    clearError();

    try {
      const results = await searchTags(query, {
        khanda_id: filters.khandaId,
        adhyaya_id: filters.adhyayaId,
        main_topic: filters.mainTopic,
        context_size: filters.contextSize,
        limit: filters.limit,
        skip: filters.skip
      });

      // Make sure we have valid results
      if (!results || typeof results !== 'object') {
        throw new Error('Invalid search results received');
      }

      // Update results in state
      setSearchResults(results);

      // Update global search state
      updateSearch({
        query,
        filters: {
          khandaId: filters.khandaId,
          adhyayaId: filters.adhyayaId,
          mainTopic: filters.mainTopic,
          contextSize: filters.contextSize,
          limit: filters.limit,
          skip: filters.skip
        },
        results: results,
        pagination: results.pagination
      });
    } catch (error) {
      console.error('Search error:', error);
      setError(error.message || 'An error occurred while searching. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle search submission
  const handleSearch = (query) => {
    if (!query || query.trim() === '') return;
    
    // Update search query in state
    setSearchQuery(query);
    
    // Reset pagination on new search
    const updatedFilters = {
      ...searchFilters,
      skip: 0
    };
    
    // Update filters in state then perform search
    setSearchFilters(updatedFilters);
    
    // Perform search with the updated filters
    setTimeout(() => {
      performSearch(query, updatedFilters);
    }, 0);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {

    // Reset pagination when filters change
    const updatedFilters = {
      ...newFilters,
      skip: 0,
      contextSize: 100 // Fixed context size
    };
    
    // Update filters in state
    setSearchFilters(updatedFilters);

    // Only perform search if we have a query
    if (searchQuery && searchQuery.trim() !== '') {

      // Use setTimeout to ensure state is updated before performing search
      setTimeout(() => {
        performSearch(searchQuery, updatedFilters);
      }, 0);
    }
  };

  // Handle pagination (load more)
  const handleLoadMore = () => {
    const updatedFilters = {
      ...searchFilters,
      skip: searchFilters.skip + searchFilters.limit
    };
    setSearchFilters(updatedFilters);

    // Perform search with updated pagination
    performSearch(searchQuery, updatedFilters);
  };

  // Render loading state
  if (uiState.isLoading && !searchResults) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-900 mb-4"></div>
          <p className="text-orange-900 text-xl">Searching...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Page title */}
        <div className="mb-6">
          <h2 className="text-2xl font-serif font-bold text-orange-900">
            {searchQuery ? (
              <>
                Search Results: <span className="text-orange-700">{searchQuery}</span>
              </>
            ) : (
              "Search"
            )}
          </h2>
        </div>

        {/* Error state */}
        {uiState.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p className="font-bold">Error</p>
            <p>{uiState.error}</p>
          </div>
        )}

        {/* Search bar */}
        <SearchBar initialQuery={searchQuery} onSearch={handleSearch} />

        {/* Filters */}
        <RefineFilters 
          filters={searchFilters} 
          onFilterChange={handleFilterChange} 
        />

        {/* Initial empty state */}
        {!searchQuery && !searchResults && <EmptySearchState />}

        {/* No results state */}
        {searchQuery && searchResults && searchResults.results.length === 0 && (
          <div className="bg-white p-8 rounded-lg shadow-sm text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-orange-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12a2 2 0 100-4 2 2 0 000 4z" />
            </svg>
            <h3 className="text-xl font-serif font-bold text-orange-800 mb-2">No Results Found</h3>
            <p className="text-orange-700 mb-4">
              We couldn't find any tags matching "{searchQuery}"
              {searchFilters.khandaId && <span> in khanda {searchFilters.khandaId}</span>}
              {searchFilters.adhyayaId && <span> adhyaya {searchFilters.adhyayaId}</span>}
              {searchFilters.mainTopic && <span> for topic "{searchFilters.mainTopic}"</span>}.
            </p>
            <div className="mt-4">
              <button
                onClick={() => handleFilterChange({
                  khandaId: null,
                  adhyayaId: null,
                  mainTopic: null,
                  contextSize: 100
                })}
                className="px-4 py-2 bg-orange-100 text-orange-800 rounded hover:bg-orange-200"
              >
                Clear filters and try again
              </button>
            </div>
          </div>
        )}

        {/* Search results */}
        {searchResults && searchResults.results.length > 0 && (
          <SearchResults 
            results={searchResults} 
            onLoadMore={handleLoadMore} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-orange-900 text-amber-50 py-4 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Ramayana Tagging Engine | Sanskrit Digital Humanities Project</p>
        </div>
      </footer>
    </div>
  );
};

export default SearchResultsPage;
