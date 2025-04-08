import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchKhandasStructure } from '../services/api';

/**
 * Application-wide context for managing state
 */
export const AppContext = createContext();

/**
 * Custom hook to use the AppContext
 * @returns {Object} The context value
 */
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

/**
 * Provider component for AppContext
 */
export const AppProvider = ({ children }) => {
  // Kaandas data
  const [khandas, setKhandas] = useState([]);

  // Active content state
  const [activeContent, setActiveContent] = useState({
    khandaId: null,    // kaandaId
    adhyayaId: null,   // sargaId
    activeTag: null
  });
  
  // Track active tags by kaanda & sarga
  const [activeTags, setActiveTags] = useState({});  // Format: { 'kaandaId_sargaId': { tagName, tagDetails } }

  // Search state
  const [searchState, setSearchState] = useState({
    query: '',
    filters: {
      khandaId: null,     // kaandaId
      adhyayaId: null,    // sargaId
      mainTopic: null,
      contextSize: 100,
      limit: 20,
      skip: 0
    },
    results: null,
    pagination: null
  });

  // UI state
  const [uiState, setUiState] = useState({
    isLoading: false,
    error: null,
    sidebarOpen: true,
    tagDetailsPanelOpen: false
  });

  // Cache state for performance
  const [cache, setCache] = useState({
    adhyayaContent: {}, // Key format: `${kaandaId}_${sargaId}`
    tagDetails: {},     // Key format: `${kaandaId}_${sargaId}_${tagName}`
    searchResults: {}   // Key format based on search params
  });

  /**
   * Set loading state
   */
  const setLoading = useCallback((isLoading) => {
    setUiState(prev => ({ ...prev, isLoading, error: isLoading ? null : prev.error }));
  }, []);

  /**
   * Set error state
   */
  const setError = useCallback((error) => {
    setUiState(prev => ({ ...prev, error, isLoading: false }));
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setUiState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * Update search query and filters
   */
  const updateSearch = useCallback((newSearchParams) => {
    setSearchState(prev => ({
      ...prev,
      ...newSearchParams,
    }));
  }, []);

  /**
   * Set active kaanda and sarga
   */
  const setActiveAdhyaya = useCallback((khandaId, adhyayaId) => {
    // Check if there's a stored tag for this sarga
    const key = `${khandaId}_${adhyayaId}`;
    const storedTagInfo = activeTags[key];
    
    setActiveContent(prev => ({
      ...prev,
      khandaId,
      adhyayaId,
      // Use the stored tag if available, otherwise null
      activeTag: storedTagInfo?.tagName || null
    }));
    
    // If there's a stored tag, also make sure the tag panel is open
    if (storedTagInfo?.tagName) {
      setUiState(prev => ({
        ...prev,
        tagDetailsPanelOpen: true
      }));
    }
  }, [activeTags]);

  /**
   * Set active tag within current sarga
   */
  const setActiveTag = useCallback((tagName) => {
    // Update the active content state
    setActiveContent(prev => ({
      ...prev,
      activeTag: tagName
    }));

    // If we have current kaanda and sarga, also store in the per-sarga state
    if (activeContent.khandaId && activeContent.adhyayaId) {
      const key = `${activeContent.khandaId}_${activeContent.adhyayaId}`;
      
      if (tagName) {
        // Set the tag for this kaanda/sarga
        setActiveTags(prev => ({
          ...prev,
          [key]: {
            ...prev[key],
            tagName
          }
        }));
      } else {
        // Clear the tag for this kaanda/sarga
        setActiveTags(prev => {
          // Create a new object without this entry
          const newState = { ...prev };
          delete newState[key];
          return newState;
        });
      }
    }

    // Open tag details panel when a tag is selected
    setUiState(prev => ({
      ...prev,
      tagDetailsPanelOpen: !!tagName
    }));
  }, [activeContent.khandaId, activeContent.adhyayaId]);
  
  /**
   * Set tag details for a specific kaanda/sarga
   */
  const setTagDetailsForAdhyaya = useCallback((khandaId, adhyayaId, tagDetails) => {
    if (!khandaId || !adhyayaId || !tagDetails) return;
    
    const key = `${khandaId}_${adhyayaId}`;

    setActiveTags(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        tagName: tagDetails.tag_name, // Also set tagName from tagDetails
        tagDetails
      }
    }));
  }, []);
  
  /**
   * Get active tag for a specific kaanda/sarga
   */
  const getActiveTagForAdhyaya = useCallback((khandaId, adhyayaId) => {
    if (!khandaId || !adhyayaId) return null;
    
    const key = `${khandaId}_${adhyayaId}`;
    return activeTags[key]?.tagName || null;
  }, [activeTags]);
  
  /**
   * Get tag details for a specific kaanda/sarga
   */
  const getTagDetailsForAdhyaya = useCallback((khandaId, adhyayaId) => {
    if (!khandaId || !adhyayaId) return null;
    
    const key = `${khandaId}_${adhyayaId}`;
    return activeTags[key]?.tagDetails || null;
  }, [activeTags]);

  /**
   * Toggle sidebar visibility
   */
  const toggleSidebar = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      sidebarOpen: !prev.sidebarOpen
    }));
  }, []);

  /**
   * Toggle tag details panel visibility
   */
  const toggleTagDetailsPanel = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      tagDetailsPanelOpen: !prev.tagDetailsPanelOpen
    }));
  }, []);

  /**
   * Add item to cache
   */
  const addToCache = useCallback((type, key, data) => {
    setCache(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: {
          data,
          timestamp: Date.now()
        }
      }
    }));
  }, []);

  /**
   * Get item from cache
   * @returns {Object|null} The cached item or null if not found/expired
   */
  const getFromCache = useCallback((type, key, maxAge = 300000) => { // Default max age: 5 minutes
    const cachedItem = cache[type]?.[key];
    if (!cachedItem) return null;

    // Check if cache is still valid
    if (Date.now() - cachedItem.timestamp > maxAge) {
      // Cache expired
      return null;
    }

    return cachedItem.data;
  }, [cache]);

  /**
   * Clear specific cache or all cache
   */
  const clearCache = useCallback((type = null) => {
    if (type) {
      setCache(prev => ({
        ...prev,
        [type]: {}
      }));
    } else {
      setCache({
        adhyayaContent: {},
        tagDetails: {},
        searchResults: {}
      });
    }
  }, []);

  // Load kaandas structure on component mount
  useEffect(() => {
    const loadKaandas = async () => {
      try {
        setLoading(true);
        const data = await fetchKhandasStructure();
        setKhandas(data.khandas || []);
      } catch (error) {
        setError(error.message || 'Failed to load kaandas structure');
        console.error('Error loading kaandas structure:', error);
      } finally {
        setLoading(false);
      }
    };

    loadKaandas();
  }, [setLoading, setError]);

  // Context value
  const contextValue = {
    // State
    khandas,
    activeContent,
    searchState,
    uiState,
    activeTags,

    // Setters
    setKhandas,
    setActiveAdhyaya,
    setActiveTag,
    updateSearch,
    setLoading,
    setError,
    clearError,
    toggleSidebar,
    toggleTagDetailsPanel,
    
    // Adhyaya-specific tag functions
    setTagDetailsForAdhyaya,
    getActiveTagForAdhyaya,
    getTagDetailsForAdhyaya,

    // Cache functions
    addToCache,
    getFromCache,
    clearCache
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};
