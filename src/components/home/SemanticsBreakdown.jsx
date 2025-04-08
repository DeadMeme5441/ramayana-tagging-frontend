import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { fetchPopularMainTopics } from '../../services/api';

const SemanticsBreakdown = () => {
  const navigate = useNavigate();
  const { searchState, updateSearch } = useAppContext();
  
  // Local state for popular main topics
  const [semanticCategories, setSemanticCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});

  // Fetch popular main topics on component mount
  useEffect(() => {
    const loadSemanticCategories = async () => {
      try {
        setIsLoading(true);
        // Fetch main topics with the most tags
        const response = await fetchPopularMainTopics(7);

        if (response && response.popular_topics) {
          setSemanticCategories(response.popular_topics);
        }
        setError(null);
      } catch (error) {
        console.error('Error loading semantic categories:', error);
        setError(error.message || 'Failed to load semantic categories');
      } finally {
        setIsLoading(false);
      }
    };

    loadSemanticCategories();
  }, []);

  // Toggle expanded state for a category
  const toggleCategoryExpansion = (categoryName) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  // Handle click on "View all tags" button
  const handleViewAllTagsClick = (categoryName) => {
    // Update the global search state with the category as the query
    updateSearch({
      query: categoryName,
      filters: {
        ...searchState.filters,
        khandaId: null,
        adhyayaId: null,
        main_topic: categoryName,
        skip: 0
      }
    });

    // Navigate to search results page
    navigate('/search');
  };

  // Handle click on a subject info item
  const handleSubjectInfoClick = (info, event) => {
    // Stop propagation to prevent the parent category handler from firing
    event.stopPropagation();

    // Update the global search state with the specific subject info as the query
    updateSearch({
      query: info,
      filters: {
        ...searchState.filters,
        khandaId: null,
        adhyayaId: null,
        skip: 0
      }
    });

    // Navigate to search results page
    navigate('/search');
  };

  return (
    <>
      <h2 className="text-2xl font-serif font-bold text-orange-900 mb-4">
        Semantic Tags
      </h2>
      <p className="text-orange-800 mb-6 text-sm">
        The text is annotated with tags highlighting key concepts, characters, and events.
      </p>
      <br/>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center py-6">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-orange-700"></div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 p-4 rounded-lg text-red-700 mb-4">
          <p className="font-medium text-sm">Error loading categories:</p>
          <p className="mt-1 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-800 rounded text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {/* Categories List */}
      {!isLoading && !error && (
        <div className="space-y-3">
          {semanticCategories.length > 0 ? (
            semanticCategories.map(category => (
              <div
                key={category.name}
                className="bg-white rounded-lg border border-orange-200 overflow-hidden hover:shadow-md transition"
              >
                <div
                  onClick={() => toggleCategoryExpansion(category.name)}
                  className="px-5 py-4 bg-orange-100 cursor-pointer hover:bg-orange-200 transition"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-serif font-bold text-orange-900 text-lg">{category.name}</h3>
                    <div className="text-orange-700 hover:text-orange-900">
                      {expandedCategories[category.name] ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-orange-700 mt-1">
                    <span>{category.tag_count} unique tags</span>
                    {category.occurrence_count && (
                      <span className="ml-2">· {category.occurrence_count} occurrences</span>
                    )}
                  </div>
                </div>

                {/* Subject Info Section */}
                {expandedCategories[category.name] && (
                  <div className="p-4 bg-orange-50">
                    <div className="text-xs text-orange-700 mb-2">Examples from this category:</div>
                    {category.subject_info && category.subject_info.length > 0 ? (
                      <ul className="space-y-2">
                        {category.subject_info.slice(0, 5).map((info, index) => (
                          <li
                            key={index}
                            onClick={(e) => handleSubjectInfoClick(info, e)}
                            className="px-3 py-2 bg-white text-orange-800 border border-orange-200 rounded-md font-serif text-sm cursor-pointer hover:bg-orange-50"
                          >
                            {info}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-orange-700 italic text-sm">
                        No examples available for this category.
                      </p>
                    )}
                    
                    {category.subject_info && category.subject_info.length > 5 && (
                      <p className="text-xs text-orange-600 mt-2 italic">
                        Showing 5 of {category.subject_info.length} examples
                      </p>
                    )}
                    
                    <button
                      onClick={() => handleViewAllTagsClick(category.name)}
                      className="mt-3 w-full px-3 py-2 text-sm bg-orange-200 text-orange-900 rounded hover:bg-orange-300 transition"
                    >
                      View all tags in this category →
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-orange-700 italic text-sm">
              No semantic categories found. The database may be empty or still indexing.
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SemanticsBreakdown;
