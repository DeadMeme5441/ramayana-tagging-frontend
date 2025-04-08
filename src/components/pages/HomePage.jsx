import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { fetchPopularMainTopics } from '../../services/api';

const HomePage = () => {
  const navigate = useNavigate();
  const {
    khandas,
    uiState,
    searchState,
    updateSearch
  } = useAppContext();

// Local state for popular main topics (not stored in global context)
  const [popularTopics, setPopularTopics] = useState([]);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [topicsError, setTopicsError] = useState(null);

  // Local state for search input
  const [searchInput, setSearchInput] = useState('');

  // Track expanded topics for sample tags
  const [expandedTopics, setExpandedTopics] = useState({});

  // Fetch popular main topics on component mount
  useEffect(() => {
    const loadPopularTopics = async () => {
      try {
        setTopicsLoading(true);
        // Fetch main topics with the most tags
        const response = await fetchPopularMainTopics(5); // Get top 10 topics

        if (response && response.popular_topics) {
          setPopularTopics(response.popular_topics);
        }
        setTopicsError(null);
      } catch (error) {
        console.error('Error loading popular topics:', error);
        setTopicsError(error.message || 'Failed to load popular topics');
      } finally {
        setTopicsLoading(false);
      }
    };

    loadPopularTopics();
  }, []);

  // Toggle expanded state for a topic
  const toggleTopicExpansion = (topicName) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicName]: !prev[topicName]
    }));
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();

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

// Handle click on a popular tag or topic
  const handleTopicClick = (topicName) => {
    // Update the global search state with the topic as the query
    updateSearch({
      query: topicName,
      filters: {
        ...searchState.filters,
        khandaId: null,  // Reset any filters
        adhyayaId: null,
        main_topic: topicName, // Filter by this main topic
        skip: 0         // Start from the first page
      }
    });

    // Navigate to search results page
    navigate('/search');
  };

  // Handle click on a sample tag
  const handleSampleTagClick = (tagName, event) => {
    // Stop propagation to prevent the parent topic handler from firing
    event.stopPropagation();

    // Update the global search state with the specific tag as the query
    updateSearch({
      query: tagName,
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

  // Handle click on a khanda
  const handleKhandaClick = (khandaId) => {
    // For now just navigate to the first adhyaya
    // In a more advanced implementation, we might want to show a list of adhyayas
    if (khandas && khandas.length > 0) {
      const khanda = khandas.find(k => k.id === khandaId);
      if (khanda && khanda.adhyayas && khanda.adhyayas.length > 0) {
        navigate(`/read/${khandaId}/${khanda.adhyayas[0].id}`);
        return;
      }
    }

    // Fallback if we couldn't find the first adhyaya
    navigate(`/read/${khandaId}/1`);
  };

  // Render loading state for the entire page if khandas are loading
  if (uiState.isLoading && khandas.length === 0) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-900 mb-4"></div>
          <p className="text-orange-900 text-xl">Loading Ramayana Tagging Engine...</p>
        </div>
      </div>
    );
  }

  // Render error state if there's a global error
  if (uiState.error) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center bg-red-50 p-6 rounded-lg shadow-md max-w-md">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Data</h2>
          <p className="text-red-700 mb-4">{uiState.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-700 text-white rounded-lg hover:bg-orange-800"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-orange-900 text-amber-50 py-4 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold">रामायण तत्त्वानुक्रमणिका</h1>
          <h2 className="text-xl">Ramayana Tagging Engine</h2>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-orange-900 mb-4">
            Explore the Ramayana through its Tags
          </h2>
          <p className="text-orange-800 mb-8 max-w-2xl mx-auto">
            Search and navigate through the epics using a comprehensive tagging system
            that identifies key concepts, characters, events, and teachings.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for tags like कथा, धर्मः, or श्रीराम..."
              className="w-full px-6 py-3 rounded-full border-2 border-orange-300 focus:border-orange-500 focus:outline-none text-lg shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bg-orange-700 text-white p-2 rounded-full hover:bg-orange-800 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Popular Topics */}
        <div className="mb-16">
          <h3 className="text-xl font-serif font-bold text-orange-800 mb-4">Most Frequent Tags</h3>

          {/* Topics loading state */}
          {topicsLoading && (
            <div className="flex justify-center py-4">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-orange-700"></div>
            </div>
          )}

          {/* Topics error state */}
          {topicsError && (
            <div className="bg-red-50 p-3 rounded-lg text-red-700 mb-4">
              <p>Error loading topics: {topicsError}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-red-800 underline mt-1"
              >
                Retry
              </button>
            </div>
          )}

          {/* Topics content - single column layout */}
          {!topicsLoading && !topicsError && (
            <div className="space-y-3">
              {popularTopics.length > 0 ? (
                popularTopics.map(topic => (
                  <div
                    key={topic.name}
                    className="bg-white rounded-lg border border-orange-200 overflow-hidden hover:shadow-md transition"
                  >
                    <div
                      onClick={() => handleTopicClick(topic.name)}
                      className="px-4 py-3 bg-orange-100 flex justify-between items-center cursor-pointer hover:bg-orange-200 transition"
                    >
                      <div className="flex-1">
                        <span className="font-serif font-bold text-orange-900">{topic.name}</span>
                        <div className="text-sm text-orange-700">
                          <span className="mr-2">{topic.tag_count} unique tags</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTopicExpansion(topic.name);
                        }}
                        className="text-orange-700 hover:text-orange-900"
                      >
                        {expandedTopics[topic.name] ?
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg> :
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        }
                      </button>
                    </div>

                    {/* Subject Info Section */}
                    {expandedTopics[topic.name] && topic.subject_info && topic.subject_info.length > 0 && (
                      <div className="p-4 bg-orange-50">
                        <div className="text-xs text-orange-700 mb-2">Subject Information:</div>
                        <ul className="space-y-1">
                          {topic.subject_info.map((info, index) => (
                            <li
                              key={index}
                              className="px-3 py-2 bg-white text-orange-800 border border-orange-200 rounded-md font-serif text-sm"
                            >
                              {info}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Empty state for subject info */}
                    {expandedTopics[topic.name] && (!topic.subject_info || topic.subject_info.length === 0) && (
                      <div className="p-4 bg-orange-50 text-orange-700 italic text-sm">
                        No subject information available for this topic.
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-orange-700 italic">No topics found. The database may be empty or still indexing.</p>
              )}
            </div>
          )}
        </div>

        {/* Tagging System Explanation */}
        <div className="mt-16 bg-orange-50 p-6 rounded-lg border border-orange-200">
          <h3 className="text-xl font-serif font-bold text-orange-800 mb-3">About the Tagging System</h3>
          <p className="text-orange-700 mb-4">
            Our tagging system divides the Ramayana into semantic categories that help identify themes, concepts,
            and narratives throughout the text. Each tag consists of a main category and subject information.
          </p>
          <div className="bg-white p-4 rounded border border-orange-200">
            <code className="block text-sm text-orange-800 font-mono">
              &lt;कथा;नारदं प्रति वाल्मीकिमुनेः प्रश्नः&gt; ... &lt;/कथा;नारदं प्रति वाल्मीकिमुनेः प्रश्नः&gt;
            </code>
            <p className="mt-2 text-sm text-orange-600">
              This tag marks a narrative section about "Valmiki's question to Narada," categorized under "कथा" (story).
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-900 text-amber-50 py-4 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Ramayana Tagging Engine | Sanskrit Digital Humanities Project</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
