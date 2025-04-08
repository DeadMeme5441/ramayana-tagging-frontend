import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import SearchAutocomplete from '../common/SearchAutocomplete';

const HeroSection = () => {
  const navigate = useNavigate();
  const { searchState, updateSearch } = useAppContext();
  const [searchInput, setSearchInput] = useState('');

  // Handle search form submission
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    
    if (!searchInput.trim()) return;

    // Update the global search state
    updateSearch({
      query: searchInput,
      filters: {
        ...searchState.filters,
        khandaId: null,  // Reset any filters
        adhyayaId: null,
        skip: 0         // Start from the first page
      }
    });

    // Navigate to search results page
    navigate('/search');
  };

  // Handle search from autocomplete
  const handleAutocompleteSearch = (query) => {
    if (!query?.trim()) return;
    
    updateSearch({
      query,
      filters: {
        ...searchState.filters,
        khandaId: null,
        adhyayaId: null,
        skip: 0
      }
    });
    
    navigate('/search');
  };

  return (
    <section className="bg-gradient-to-b from-orange-100 to-amber-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-orange-900 mb-6">
            Explore the Ramayana through its Tags
          </h2>
          <p className="text-orange-800 mb-8 max-w-2xl mx-auto text-lg">
            Discover the wealth of knowledge in the ancient Sanskrit epic through our comprehensive tagging system.
            Search for concepts, characters, events, and philosophical teachings.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <SearchAutocomplete
              initialValue={searchInput}
              onSearch={handleAutocompleteSearch}
              placeholder="Search for tags like कथा, धर्मः, or श्रीराम..."
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;