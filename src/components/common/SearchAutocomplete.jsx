// src/components/common/SearchAutocomplete.jsx
import React, { useState, useEffect, useRef } from 'react';
import { fetchTagSuggestions } from '../../services/api';

const SearchAutocomplete = ({
  initialValue = '',
  onSearch,
  placeholder = 'Search for tags...',
  suggestionsLimit = 10,
  className = ''
}) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Load suggestions when input value changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetchTagSuggestions(inputValue, suggestionsLimit);
        setSuggestions(response.suggestions || []);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the API calls to avoid making too many requests
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions();
    }, 300); // 300ms debounce

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputValue, suggestionsLimit]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    // Handle keyboard navigation
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prevIndex =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
      );
      setShowSuggestions(true);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSuggestionClick(suggestions[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.name);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    if (onSearch) {
      onSearch(suggestion.name);
    }
  };

  const handleSearch = () => {
    if (onSearch && inputValue.trim()) {
      onSearch(inputValue);
    }
    setShowSuggestions(false);
  };

  // Highlight matching text in suggestions
  const highlightMatch = (text, query) => {
    if (!query || !text) return text;

    try {
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return text.replace(regex, '<mark class="bg-yellow-200 px-0.5 rounded">$1</mark>');
    } catch (e) {
      return text;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue.trim().length >= 2 && setShowSuggestions(true)}
          placeholder={placeholder}
          className="w-full px-4 py-2 rounded-full border-2 border-orange-300 focus:border-orange-500 focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-orange-700 hover:text-orange-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-orange-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-3 text-center text-orange-800">
              <div className="inline-block animate-spin h-4 w-4 border-t-2 border-b-2 border-orange-600 rounded-full mr-2"></div>
              Loading suggestions...
            </div>
          ) : suggestions.length > 0 ? (
            <ul>
              {suggestions.map((suggestion, index) => (
                <li
                  key={`${suggestion.name}-${index}`}
                  className={`px-4 py-2 cursor-pointer hover:bg-orange-50 ${selectedIndex === index ? 'bg-orange-100' : ''}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="font-medium text-gray-800" dangerouslySetInnerHTML={{
                    __html: highlightMatch(suggestion.name, inputValue)
                  }} />

                  {suggestion.main_topics && suggestion.main_topics.length > 0 && (
                    <div className="text-xs text-orange-700 mt-1">
                      {suggestion.main_topics[0]}
                      {suggestion.main_topics.length > 1 && ` +${suggestion.main_topics.length - 1} more`}
                    </div>
                  )}

                  {suggestion.match_type === "subject_info" && suggestion.subject_info && suggestion.subject_info.length > 0 && (
                    <div className="text-xs text-gray-600 mt-0.5 italic">
                      {suggestion.subject_info.map((info, i) => (
                        <span key={i}
                          className="inline-block mr-1"
                          dangerouslySetInnerHTML={{
                            __html: inputValue && info.toLowerCase().includes(inputValue.toLowerCase())
                              ? highlightMatch(info, inputValue)
                              : info
                          }}
                        />
                      ))}
                    </div>
                  )}

                  <div className="text-xs text-orange-600 mt-1">
                    {suggestion.occurrence_count} occurrence{suggestion.occurrence_count !== 1 ? 's' : ''}
                  </div>
                </li>
              ))}
            </ul>
          ) : inputValue.trim().length >= 2 ? (
            <div className="p-3 text-center text-orange-800">
              No suggestions found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchAutocomplete;
