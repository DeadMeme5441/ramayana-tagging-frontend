import React, { useEffect } from 'react';
import SearchResultItem from './SearchResultItem';

const SearchResults = ({ results, onLoadMore }) => {
  // Debug: log results when they change
  useEffect(() => {
    console.log("SearchResults component received:", results.length);
  }, [results]);
  
  // Guard against invalid results
  if (!results || !results.results) {
    console.log("No valid results to display");
    return null;
  }

  // Get total results count
  const getTotalResults = () => {
    if (!results || !results.statistics) {
      return 0;
    }
    return results.statistics.match_count || 0;
  };

  // Flatten results for display without category separation
  const flattenResults = () => {
    if (!results || !results.results) {
      return [];
    }
    return results.results;
  };

  const flatResults = flattenResults();

  return (
    <div>
      {/* Results statistics */}
      <div className="mb-4">
        <p className="text-orange-800">
          Found {getTotalResults()} matches across {results.statistics?.tag_count || 0} tags
        </p>
      </div>

      {/* Flat Results List */}
      {flatResults.length > 0 ? (
        <div className="space-y-6">
          {flatResults.map((result, index) => (
            <SearchResultItem key={`${result.tag_name}-${index}`} result={result} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-orange-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
          <h3 className="text-xl font-serif font-bold text-orange-800 mb-2">No Results Found</h3>
          <p className="text-orange-700 mb-4">
            No matching tags were found for your search. Try different keywords or adjusting your filters.
          </p>
        </div>
      )}

      {/* Pagination */}
      {results.pagination?.has_more && (
        <div className="mt-8 text-center">
          <button
            onClick={onLoadMore}
            className="px-6 py-2 bg-orange-700 text-white rounded-lg hover:bg-orange-800"
          >
            Load More Results
          </button>
          <p className="text-sm text-orange-700 mt-2">
            Showing {results.results.length} of {results.pagination.total} tags
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
