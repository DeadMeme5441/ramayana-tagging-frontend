import React, { useState, useEffect } from 'react';
import SearchAutocomplete from '../common/SearchAutocomplete';

const SearchBar = ({ initialQuery, onSearch }) => {
  const [query, setQuery] = useState(initialQuery || '');

  // Update state when initialQuery changes from parent
  useEffect(() => {
    setQuery(initialQuery || '');
  }, [initialQuery]);

  // Handle search from autocomplete
  const handleAutocompleteSearch = (newQuery) => {
    if (newQuery && newQuery.trim() !== '') {
      setQuery(newQuery);
      onSearch(newQuery);
    }
  };

  // Handle manual search button click
  const handleSearchClick = () => {
    if (query && query.trim() !== '') {
      onSearch(query);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row gap-2">
        <div className="flex-grow">
          <SearchAutocomplete
            initialValue={query}
            onSearch={handleAutocompleteSearch}
            placeholder="Search for tags like कथा, धर्मः, or श्रीराम..."
            className="w-full"
            manualQueryUpdate={(newQuery) => setQuery(newQuery)}
          />
        </div>
        <button
          onClick={handleSearchClick}
          className="px-6 py-2 bg-orange-700 text-white rounded-lg hover:bg-orange-800 transition"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;