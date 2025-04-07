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
  // Khandas data
  const [khandas, setKhandas] = useState([]);

  // Active content state
  const [activeContent, setActiveContent] = useState({
    khandaId: null,
    adhyayaId: null,
    activeTag: null
  });

  // Search state
  const [searchState, setSearchState] = useState({
    query: '',
    filters: {
      khandaId: null,
      adhyayaId: null,
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
    adhyayaContent: {}, // Key format: `${khandaId}_${adhyayaId}`
    tagDetails: {},     // Key format: `${khandaId}_${adhyayaId}_${tagName}`
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
   * Set active khanda and adhyaya
   */
  const setActiveAdhyaya = useCallback((khandaId, adhyayaId) => {
    setActiveContent(prev => ({
      ...prev,
      khandaId,
      adhyayaId,
      activeTag: null // Reset active tag when changing adhyaya
    }));
  }, []);

  /**
   * Set active tag within current adhyaya
   */
  const setActiveTag = useCallback((tagName) => {
    setActiveContent(prev => ({
      ...prev,
      activeTag: tagName
    }));

    // Open tag details panel when a tag is selected
    setUiState(prev => ({
      ...prev,
      tagDetailsPanelOpen: !!tagName
    }));
  }, []);

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

  // Load khandas structure on component mount
  useEffect(() => {
    const loadKhandas = async () => {
      try {
        setLoading(true);
        const data = await fetchKhandasStructure();
        setKhandas(data.khandas || []);
      } catch (error) {
        setError(error.message || 'Failed to load khandas structure');
        console.error('Error loading khandas structure:', error);
      } finally {
        setLoading(false);
      }
    };

    loadKhandas();
  }, [setLoading, setError]);

  // Context value
  const contextValue = {
    // State
    khandas,
    activeContent,
    searchState,
    uiState,

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
