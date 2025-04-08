import React, { useState, useEffect, useRef } from 'react';
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

  // Track if this is the initial mount
  const isInitialMount = useRef(true);

  // Get app context with tag management functions
  const {
    khandas,
    activeContent,
    setActiveAdhyaya,
    setLoading,
    setError,
    clearError,
    addToCache,
    getFromCache,
    setActiveTag: setContextActiveTag,
    setTagDetailsForAdhyaya,
    getActiveTagForAdhyaya,
    getTagDetailsForAdhyaya
  } = useAppContext();

  // Component state
  const [adhyayaContent, setAdhyayaContent] = useState(null);
  const [activeTag, setActiveTag] = useState(null);
  const [tagDetailsPanelOpen, setTagDetailsPanelOpen] = useState(false);
  const [tagDetails, setTagDetails] = useState(null);
  const [navigationSidebarOpen, setNavigationSidebarOpen] = useState(true);

  // Update active adhyaya in context when component mounts or route changes
  useEffect(() => {
    // Set the active adhyaya in context
    setActiveAdhyaya(khandaId, adhyayaId);
    
    // For cleaner code tracking
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }
  }, [khandaId, adhyayaId, setActiveAdhyaya]);

  // Function to fetch adhyaya content from API or cache
  const fetchContent = async () => {
    if (!khandaId || !adhyayaId) return;

    const cacheKey = `${khandaId}_${adhyayaId}`;
    const cachedData = getFromCache('adhyayaContent', cacheKey);

    if (cachedData) {
      setAdhyayaContent(cachedData);
      
      // Get tag to activate - prioritize URL param, then context
      let tagToActivate = highlightTagFromSearch;
      
      if (!tagToActivate) {
        // Check context for a stored tag
        const storedTagName = getActiveTagForAdhyaya(khandaId, adhyayaId);
        tagToActivate = storedTagName;
      }
      
      // If we have a tag to activate, do it after a longer delay to ensure DOM is ready
      if (tagToActivate) {
        setTimeout(() => {
          handleTagClick(tagToActivate);
        }, 500);
      }
      return;
    }

    try {
      setLoading(true);
      clearError();

      const data = await fetchAdhyayaContent(khandaId, adhyayaId);
      setAdhyayaContent(data);
      addToCache('adhyayaContent', cacheKey, data);

      // Get tag to activate - prioritize URL param, then context
      let tagToActivate = highlightTagFromSearch;
      
      if (!tagToActivate) {
        // Check context for a stored tag
        const storedTagName = getActiveTagForAdhyaya(khandaId, adhyayaId);
        tagToActivate = storedTagName;
      }
      
      // If we have a tag to activate, do it after a longer delay to ensure DOM is ready
      if (tagToActivate) {
        setTimeout(() => {
          handleTagClick(tagToActivate);
        }, 500);
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
    
    // Sync component state with context on mount and parameter changes
    const storedTag = getActiveTagForAdhyaya(khandaId, adhyayaId);
    const storedDetails = getTagDetailsForAdhyaya(khandaId, adhyayaId);
    

    // Set active tag based on either URL parameter or stored value
    const newActiveTag = highlightTagFromSearch || (storedTag || null);
    
    if (newActiveTag) {
      // We have an active tag to set
      console.log(`Setting active tag in AdhyayaReader to:`, newActiveTag);
      setActiveTag(newActiveTag);
      setTagDetailsPanelOpen(true);
      
      // If we have stored details, use them
      if (storedDetails) {
        setTagDetails(storedDetails);
      }
    } else {
      // Reset when changing to a new adhyaya with no active tag
      setActiveTag(null);
      setTagDetailsPanelOpen(false);
      setTagDetails(null);
    }
  }, [khandaId, adhyayaId, highlightTagFromSearch]);

  // Handle scrolling to tags when content and tags are loaded
  useEffect(() => {
    // Only proceed if we have content loaded
    if (!adhyayaContent) return;
    
    // Get the current active tag
    const currentActiveTag = activeTag || 
                           highlightTagFromSearch || 
                           getActiveTagForAdhyaya(khandaId, adhyayaId);
    
    if (currentActiveTag) {
      // Trigger scrolling to the highlighted tag with a longer delay
      setTimeout(() => {
        const scrollEvent = new CustomEvent('scrollToFirstHighlight');
        window.dispatchEvent(scrollEvent);
      }, 1000);
    }
  }, [adhyayaContent, activeTag, highlightTagFromSearch, khandaId, adhyayaId]);

  // Handle tag click - fetch tag details and highlight in text
  const handleTagClick = async (tagName) => {
    if (!tagName) return;

    try {
      // If clicking the already active tag, toggle it off
      if (activeTag === tagName) {
        // Clear active tag in both local and context state
        setActiveTag(null);
        setTagDetails(null);
        setTagDetailsPanelOpen(false);
        
        // Update the context to clear this tag
        setContextActiveTag(null);
        return;
      }

      // Set the active tag immediately for better UX
      setActiveTag(tagName);
      setTagDetailsPanelOpen(true);
      
      // Update context as well
      setContextActiveTag(tagName);
      
      setLoading(true);

      // Get tag details from API or cache
      const cacheKey = `${khandaId}_${adhyayaId}_${tagName}`;
      const cachedDetails = getFromCache('tagDetails', cacheKey);

      let details;
      if (cachedDetails) {
        details = cachedDetails;
      } else {
        details = await fetchTagInAdhyaya(khandaId, adhyayaId, tagName);
        
        // Add index property to each occurrence to help with positioning
        if (details?.occurrences && details.occurrences.length > 0) {
          details.occurrences.forEach((occ, idx) => {
            occ.index = idx;
          });
        }
        
        addToCache('tagDetails', cacheKey, details);
      }

      // Set up local component state
      setTagDetails(details);
      
      // Store details in context
      setTagDetailsForAdhyaya(khandaId, adhyayaId, details);
      
      // Scroll to first occurrence
      if (details?.occurrences && details.occurrences.length > 0) {
        const firstOccurrence = details.occurrences[0];
        
        // Use a longer timeout to allow the rendering to complete
        setTimeout(() => {
          // Dispatch custom event to scroll to occurrence
          const scrollEvent = new CustomEvent('scrollToOccurrence', { 
            detail: { occurrence: firstOccurrence }
          });
          window.dispatchEvent(scrollEvent);
        }, 1000); 
      } else {
        // If no specific occurrences, just scroll to first highlight with longer delay
        setTimeout(() => {
          const scrollEvent = new CustomEvent('scrollToFirstHighlight');
          window.dispatchEvent(scrollEvent);
        }, 1000);
      }
    } catch (error) {
      console.error('Error fetching tag details:', error);
      setError(`Failed to load details for tag "${tagName}"`);
      
      // Reset active tag on error
      setActiveTag(null);
      setTagDetailsPanelOpen(false);
      setContextActiveTag(null);
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
    <div className="h-screen bg-amber-50 flex flex-col overflow-hidden">
      {/* Main content with three columns layout - fixed height */}
      <main className="flex h-full overflow-hidden">
        {/* Left Sidebar - Navigation */}
        <div className="h-full w-64 flex-shrink-0">
          <NavigationSidebar
            khandas={khandas}
            currentKhandaId={khandaId}
            currentAdhyayaId={adhyayaId}
            isOpen={navigationSidebarOpen}
            onToggle={toggleNavigationSidebar}
          />
        </div>

        {/* Main Content Area - fixed container, scrollable content */}
        <div className="flex-grow h-full overflow-hidden">
          <MainContent
            adhyayaContent={adhyayaContent}
            activeTag={activeTag}
            tagDetails={tagDetails}
            tagDetailsPanelOpen={tagDetailsPanelOpen}
            onTagDetailsPanelClose={() => {
              setTagDetailsPanelOpen(false);
              setActiveTag(null);
              // Clear in context as well
              setContextActiveTag(null);
            }}
            khandaId={khandaId}
            adhyayaId={adhyayaId}
            navigationSidebarOpen={navigationSidebarOpen}
            toggleNavigationSidebar={toggleNavigationSidebar}
          />
        </div>

        {/* Right Sidebar - Tags List */}
        <div className="h-full w-80 flex-shrink-0">
          <TagSidebar
            structuredTags={adhyayaContent.structured_tags}
            activeTag={activeTag}
            tagDetails={tagDetails}
            onTagClick={handleTagClick}
          />
        </div>
      </main>
    </div>
  );
};

export default AdhyayaReader;
