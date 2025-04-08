import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { fetchAdhyayaContent, fetchTagInAdhyaya } from '../../services/api';

// Import our refactored components
import NavigationSidebar from './navigation/NavigationSidebar';
import MainContent from './content/MainContent';
import TagSidebar from './tags/TagSidebar';

const AdhyayaReader = () => {
  // Get route parameters and search params
  const navigate = useNavigate();
  const { khanda, adhyaya } = useParams();
  const [searchParams] = useSearchParams();
  const khandaId = parseInt(khanda, 10);
  const adhyayaId = parseInt(adhyaya, 10);
  const highlightTagFromSearch = searchParams.get('tag');

  // Get app context
  const {
    khandas,
    setLoading,
    setError,
    clearError,
    addToCache,
    getFromCache
  } = useAppContext();

  // Component state
  const [adhyayaContent, setAdhyayaContent] = useState(null);
  const [activeTag, setActiveTag] = useState(highlightTagFromSearch || null);
  const [tagDetailsPanelOpen, setTagDetailsPanelOpen] = useState(!!highlightTagFromSearch);
  const [tagDetails, setTagDetails] = useState(null);
  const [navigationSidebarOpen, setNavigationSidebarOpen] = useState(true);

  // Function to fetch adhyaya content from API or cache
  const fetchContent = async () => {
    if (!khandaId || !adhyayaId) return;

    const cacheKey = `${khandaId}_${adhyayaId}`;
    const cachedData = getFromCache('adhyayaContent', cacheKey);

    if (cachedData) {
      setAdhyayaContent(cachedData);
      // If we have a tag from search params, highlight it
      if (highlightTagFromSearch) {
        handleTagClick(highlightTagFromSearch);
      }
      return;
    }

    try {
      setLoading(true);
      clearError();

      const data = await fetchAdhyayaContent(khandaId, adhyayaId);
      setAdhyayaContent(data);
      addToCache('adhyayaContent', cacheKey, data);

      // If we have a tag from search params, highlight it
      if (highlightTagFromSearch) {
        handleTagClick(highlightTagFromSearch);
      }
    } catch (error) {
      console.error('Error fetching adhyaya content:', error);
      setError(error.message || 'Failed to load adhyaya content');
    } finally {
      setLoading(false);
    }
  };

  // Fetch adhyaya content when component mounts or parameters change
  useEffect(() => {
    fetchContent();

    // Reset active tag when changing adhyaya
    setActiveTag(highlightTagFromSearch || null);
    setTagDetailsPanelOpen(!!highlightTagFromSearch);
    setTagDetails(null);
  }, [khandaId, adhyayaId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle tag click - fetch tag details and highlight in text
  const handleTagClick = async (tagName) => {
    if (!tagName) return;

    try {
      // If clicking the already active tag, toggle it off
      if (activeTag === tagName) {
        setActiveTag(null);
        setTagDetails(null);
        setTagDetailsPanelOpen(false);
        return;
      }

      setLoading(true);

      // Get tag details from API
      const cacheKey = `${khandaId}_${adhyayaId}_${tagName}`;
      const cachedDetails = getFromCache('tagDetails', cacheKey);

      let details;
      if (cachedDetails) {
        details = cachedDetails;
      } else {
        details = await fetchTagInAdhyaya(khandaId, adhyayaId, tagName);
        addToCache('tagDetails', cacheKey, details);
      }

      setTagDetails(details);
      setActiveTag(tagName);
      setTagDetailsPanelOpen(true);
    } catch (error) {
      console.error('Error fetching tag details:', error);
      setError(`Failed to load details for tag "${tagName}"`);
    } finally {
      setLoading(false);
    }
  };

  // Toggle navigation sidebar
  const toggleNavigationSidebar = () => {
    setNavigationSidebarOpen(prev => !prev);
  };

  // Render loading state
  if (!adhyayaContent) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-900 mb-4"></div>
          <p className="text-orange-900 text-xl">Loading adhyaya content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
      {/* Header that spans the full width */}
      <header className="bg-orange-900 text-amber-50 py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif font-bold cursor-pointer" onClick={() => navigate('/')}>
              रामायण तत्त्वानुक्रमणिका
            </h1>
            <h2 className="text-lg">Ramayana Tagging Engine</h2>
          </div>

          {/* Search link */}
          <div>
            <button
              className="px-4 py-2 rounded-full border-2 border-orange-300 text-white hover:bg-orange-800 transition"
              onClick={() => navigate('/search')}
            >
              Search Tags
            </button>
          </div>
        </div>
      </header>

      {/* Main content with three columns layout */}
      <main className="flex-grow flex overflow-hidden">
        {/* Left Sidebar - Navigation */}
        <NavigationSidebar
          khandas={khandas}
          currentKhandaId={khandaId}
          currentAdhyayaId={adhyayaId}
          isOpen={navigationSidebarOpen}
          onToggle={toggleNavigationSidebar}
        />

        {/* Main Content Area */}
        <MainContent
          adhyayaContent={adhyayaContent}
          activeTag={activeTag}
          tagDetails={tagDetails}
          tagDetailsPanelOpen={tagDetailsPanelOpen}
          onTagDetailsPanelClose={() => {
            setTagDetailsPanelOpen(false);
            setActiveTag(null);
          }}
          khandaId={khandaId}
          adhyayaId={adhyayaId}
          navigationSidebarOpen={navigationSidebarOpen}
          toggleNavigationSidebar={toggleNavigationSidebar}
        />

        {/* Right Sidebar - Tags List */}
        <TagSidebar
          structuredTags={adhyayaContent.structured_tags}
          activeTag={activeTag}
          onTagClick={handleTagClick}
        />
      </main>
    </div>
  );
};

export default AdhyayaReader;
