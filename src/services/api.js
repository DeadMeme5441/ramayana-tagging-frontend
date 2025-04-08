/**
 * API Service for Ramayana Tagging Engine
 *
 * This module provides methods to interact with the backend API endpoints.
 * It centralizes all API calls and handles error formatting consistently.
 */

// Base API URL - would be configured differently in production
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Helper function to format API responses and handle errors
 */
const fetchWithErrorHandling = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      // Try to parse error response
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { detail: 'Unknown error occurred' };
      }

      throw {
        status: response.status,
        message: errorData.detail || `Error: ${response.status} ${response.statusText}`,
        data: errorData,
      };
    }

    return await response.json();
  } catch (error) {
    if (error.status) {
      // This is our formatted error, throw it as is
      throw error;
    }
    // This is an unexpected error (network issue, etc.)
    throw {
      status: 0,
      message: 'Network error or server unavailable',
      originalError: error,
    };
  }
};

// TAG-RELATED ENDPOINTS

/**
 * Fetch tags with optional filtering
 *
 * @param {Object} params - Query parameters
 * @param {string} [params.main_topic] - Filter by main topic
 * @param {number} [params.min_occurrences] - Minimum number of occurrences
 * @param {number} [params.limit] - Maximum number of tags to return
 * @param {number} [params.skip] - Number of tags to skip (for pagination)
 * @returns {Promise<Object>} - Tags and pagination data
 */
export const fetchTags = async (params = {}) => {
  const queryParams = new URLSearchParams();

  if (params.main_topic) queryParams.append('main_topic', params.main_topic);
  if (params.min_occurrences) queryParams.append('min_occurrences', params.min_occurrences);
  if (params.limit) queryParams.append('limit', params.limit);
  if (params.skip) queryParams.append('skip', params.skip);

  const queryString = queryParams.toString();
  const endpoint = `/tags${queryString ? `?${queryString}` : ''}`;

  return fetchWithErrorHandling(endpoint);
};

/**
 * Fetch all available main topics for filtering
 *
 * @returns {Promise<Object>} - List of main topics
 */
export const fetchMainTopics = async () => {
  return fetchWithErrorHandling('/tags/main-topics');
};

/**
 * Fetch popular main topics based on the number of unique tags they contain
 *
 * @param {number} [limit=5] - Maximum number of topics to return
 * @returns {Promise<Object>} - Popular topics with their tag counts and sample tags
 */
export const fetchPopularMainTopics = async (limit = 10) => {
  return fetchWithErrorHandling(`/tags/popular-topics?limit=${limit}`);
};


// SEARCH-RELATED ENDPOINTS

/**
 * Search for tags in the corpus
 *
 * @param {string} query - Tag name or pattern to search for
 * @param {Object} filters - Optional filters
 * @param {number} [filters.khanda_id] - Filter by khanda ID
 * @param {number} [filters.adhyaya_id] - Filter by adhyaya ID
 * @param {string} [filters.main_topic] - Filter by main topic category
 * @param {number} [filters.context_size] - Number of characters to include as context
 * @param {number} [filters.limit] - Maximum number of results to return
 * @param {number} [filters.skip] - Number of results to skip (for pagination)
 * @returns {Promise<Object>} - Search results and metadata
 */
export const searchTags = async (query, filters = {}) => {
  if (!query) {
    throw { status: 400, message: 'Search query is required' };
  }

  const queryParams = new URLSearchParams();
  queryParams.append('query', query);

  if (filters.khanda_id) queryParams.append('khanda_id', filters.khanda_id);
  if (filters.adhyaya_id) queryParams.append('adhyaya_id', filters.adhyaya_id);
  if (filters.main_topic) queryParams.append('main_topic', filters.main_topic);
  if (filters.context_size) queryParams.append('context_size', filters.context_size);
  if (filters.limit) queryParams.append('limit', filters.limit);
  if (filters.skip) queryParams.append('skip', filters.skip);

  return fetchWithErrorHandling(`/search?${queryParams.toString()}`);
};

// CONTENT-RELATED ENDPOINTS

/**
 * Fetch the complete content of a specific adhyaya
 *
 * @param {number} khandaId - The khanda ID
 * @param {number} adhyayaId - The adhyaya ID
 * @returns {Promise<Object>} - Adhyaya content with tag information
 */
export const fetchAdhyayaContent = async (khandaId, adhyayaId) => {
  if (!khandaId || !adhyayaId) {
    throw { status: 400, message: 'Khanda ID and Adhyaya ID are required' };
  }

  return fetchWithErrorHandling(`/content/adhyaya/${khandaId}/${adhyayaId}`);
};

/**
 * Get details about a specific tag within an adhyaya
 *
 * @param {number} khandaId - The khanda ID
 * @param {number} adhyayaId - The adhyaya ID
 * @param {string} tagName - The tag name
 * @returns {Promise<Object>} - Tag details with context
 */
export const fetchTagInAdhyaya = async (khandaId, adhyayaId, tagName) => {
  if (!khandaId || !adhyayaId || !tagName) {
    throw { status: 400, message: 'Khanda ID, Adhyaya ID, and Tag Name are required' };
  }

  return fetchWithErrorHandling(`/content/tag/${khandaId}/${adhyayaId}/${encodeURIComponent(tagName)}`);
};

// NAVIGATION-RELATED ENDPOINTS

/**
 * Get the hierarchical structure of khandas and adhyayas
 *
 * @returns {Promise<Object>} - Khandas structure
 */
export const fetchKhandasStructure = async () => {
  return fetchWithErrorHandling('/navigation/khandas');
};

// ADMIN-RELATED ENDPOINTS

/**
 * Get the status of the last indexing operation (admin only)
 *
 * @param {string} apiKey - Admin API key
 * @returns {Promise<Object>} - Indexing status
 */
export const fetchIndexingStatus = async (apiKey) => {
  if (!apiKey) {
    throw { status: 403, message: 'API key is required for admin operations' };
  }

  return fetchWithErrorHandling('/admin/indexing-status', {
    headers: {
      'X-API-Key': apiKey,
    },
  });
};

/**
 * Trigger a re-indexing of the corpus (admin only)
 *
 * @param {string} apiKey - Admin API key
 * @returns {Promise<Object>} - Operation status
 */
export const triggerReindexing = async (apiKey) => {
  if (!apiKey) {
    throw { status: 403, message: 'API key is required for admin operations' };
  }

  return fetchWithErrorHandling('/admin/reindex', {
    method: 'POST',
    headers: {
      'X-API-Key': apiKey,
    },
  });
};


/**
 * Fetch tag suggestions for autocomplete
 *
 * @param {string} query - Partial text to get suggestions for
 * @param {number} [limit=10] - Maximum number of suggestions to return
 * @returns {Promise<Object>} - Tag suggestions for autocomplete
 */
export const fetchTagSuggestions = async (query, limit = 10) => {
  if (!query || query.trim().length < 2) {
    return { suggestions: [] };
  }

  const queryParams = new URLSearchParams({
    query: query.trim(),
    limit
  });

  return fetchWithErrorHandling(`/tags/suggestions?${queryParams.toString()}`);
};

