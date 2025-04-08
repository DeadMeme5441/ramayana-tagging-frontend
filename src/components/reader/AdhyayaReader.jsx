import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { fetchAdhyayaContent, fetchTagInAdhyaya } from '../../services/api';

// Import our specialized components
import SanskritTextRenderer from './SanskritTextRenderer';
import TagSidebar from './TagSidebar';
import TagDetailsPanel from './TagDetailsPanel';

const AdhyayaReader = () => {
  // Get route parameters and search params
  const { khanda, adhyaya } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const contentRef = useRef(null);

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

      // Scroll to the first occurrence of this tag if we have content
      scrollToTagOccurrence(details?.occurrences?.[0]);
    } catch (error) {
      console.error('Error fetching tag details:', error);
      setError(`Failed to load details for tag "${tagName}"`);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to scroll to a specific occurrence
  const scrollToTagOccurrence = (occurrence) => {
    if (!contentRef.current || !occurrence || !occurrence.position) return;

    scrollToPosition(occurrence.position.start);
  };

  // Helper function to scroll to a specific position in the text
  const scrollToPosition = (position) => {
    if (!contentRef.current) return;

    // Find all text nodes in the content
    const textNodes = [];
    const findTextNodes = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        textNodes.push(node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(findTextNodes);
      }
    };

    findTextNodes(contentRef.current);

    // Calculate the cumulative length to find the node containing our position
    let cumulativeLength = 0;
    for (const textNode of textNodes) {
      cumulativeLength += textNode.textContent.length;
      if (cumulativeLength >= position) {
        // We found the node containing our position
        textNode.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        break;
      }
    }
  };

  // Navigate to previous or next adhyaya
  const navigateToAdhyaya = (target) => {
    if (!adhyayaContent || !adhyayaContent.navigation) return;

    const { previous, next } = adhyayaContent.navigation;

    if (target === 'previous' && previous) {
      navigate(`/read/${previous.khanda_id}/${previous.adhyaya_id}`);
    } else if (target === 'next' && next) {
      navigate(`/read/${next.khanda_id}/${next.adhyaya_id}`);
    }
  };

  // Helper to get current khanda name
  const getCurrentKhandaName = () => {
    if (adhyayaContent && adhyayaContent.khanda_name) {
      return adhyayaContent.khanda_name;
    }

    // Fallback: find in khandas list
    const currentKhanda = khandas.find(k => k.id === khandaId);
    return currentKhanda ? currentKhanda.name : `Khanda ${khandaId}`;
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
      {/* Header */}
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

      <main className="flex-grow flex overflow-hidden">
        {/* Left Sidebar - Navigation */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} bg-white border-r border-orange-200 transition-all duration-300`}>
          <div className="p-4 border-b border-orange-200 flex justify-between items-center">
            <h3 className="font-bold text-orange-900">Navigation</h3>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-orange-500 hover:text-orange-700"
              aria-label="Close navigation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          <div className="p-2 overflow-y-auto max-h-[calc(100vh-10rem)]">
            {khandas.map(khanda => (
              <div key={khanda.id} className="mb-3">
                <div
                  className="flex items-center px-2 py-1 cursor-pointer hover:bg-orange-50"
                  onClick={() => {
                    // Toggle expansion logic for khanda
                    if (khanda.id === khandaId) {
                      // If already selected, don't do anything
                    } else {
                      // Navigate to first adhyaya of this khanda
                      if (khanda.adhyayas && khanda.adhyayas.length > 0) {
                        navigate(`/read/${khanda.id}/${khanda.adhyayas[0].id}`);
                      }
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-700 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {khanda.id === khandaId ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    )}
                  </svg>
                  <span className="font-serif text-orange-900">{khanda.name}</span>
                </div>

                {khanda.id === khandaId && (
                  <div className="pl-6 mt-1 border-l border-orange-200 ml-2">
                    {khanda.adhyayas.map(a => (
                      <div
                        key={a.id}
                        onClick={() => navigate(`/read/${khanda.id}/${a.id}`)}
                        className={`py-1 px-2 text-sm cursor-pointer ${a.id === adhyayaId ? 'bg-orange-100 text-orange-900 font-medium rounded' : 'text-orange-800 hover:bg-orange-50'}`}
                      >
                        {a.id}. {a.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Toggle sidebar button (visible when sidebar is closed) */}
        {!sidebarOpen && (
          <button
            className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-orange-100 p-2 rounded-r-md shadow-md z-10 text-orange-700 hover:bg-orange-200"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        {/* Main Content Area */}
        <div className="flex-grow overflow-y-auto p-6">
          {/* Adhyaya Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-serif font-bold text-orange-900">
                {getCurrentKhandaName()} - अध्यायः {adhyayaId}
              </h2>

              <div className="flex space-x-2">
                <button
                  className={`px-3 py-1 bg-orange-100 text-orange-800 rounded hover:bg-orange-200 ${!adhyayaContent.navigation?.previous ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => navigateToAdhyaya('previous')}
                  disabled={!adhyayaContent.navigation?.previous}
                  aria-label="Previous adhyaya"
                >
                  ← Previous
                </button>
                <button
                  className={`px-3 py-1 bg-orange-100 text-orange-800 rounded hover:bg-orange-200 ${!adhyayaContent.navigation?.next ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => navigateToAdhyaya('next')}
                  disabled={!adhyayaContent.navigation?.next}
                  aria-label="Next adhyaya"
                >
                  Next →
                </button>
              </div>
            </div>
            <h3 className="text-xl font-serif text-orange-800 mt-1">
              {adhyayaContent.title || `Adhyaya ${adhyayaId}`}
            </h3>

            {/* Active tag indicator */}
            {activeTag && (
              <div className="mt-2 bg-amber-100 px-3 py-1 rounded-md inline-flex items-center">
                <span className="text-orange-800 font-medium mr-2">Active tag: {activeTag}</span>
                <button
                  onClick={() => {
                    setActiveTag(null);
                    setTagDetails(null);
                    setTagDetailsPanelOpen(false);
                  }}
                  className="text-orange-600 hover:text-orange-800"
                  aria-label="Clear active tag"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Adhyaya Content with highlighted tags */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <SanskritTextRenderer
              content={adhyayaContent.content}
              activeTag={activeTag}
              structuredTags={adhyayaContent.structured_tags}
              contentRef={contentRef}
            />
          </div>

          {/* Tag details panel */}
          <TagDetailsPanel
            isOpen={tagDetailsPanelOpen}
            tagDetails={tagDetails}
            onClose={() => {
              setTagDetailsPanelOpen(false);
              setActiveTag(null);
            }}
            onOccurrenceClick={scrollToTagOccurrence}
          />
        </div>

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
