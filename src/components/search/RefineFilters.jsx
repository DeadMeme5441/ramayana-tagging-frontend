import React, { useState, useEffect } from 'react';
import { fetchMainTopics, fetchKhandasStructure } from '../../services/api';

const RefineFilters = ({ filters, onFilterChange }) => {
  const [khandas, setKhandas] = useState([]);
  const [mainTopics, setMainTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSection, setExpandedSection] = useState(''); // For mobile accordion view

  // Load khandas and main topics for filters
  useEffect(() => {
    const loadFilterOptions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Load khandas
        const khandasData = await fetchKhandasStructure();
        if (khandasData && khandasData.khandas) {
          setKhandas(khandasData.khandas);
        }

        // Load main topics
        const topicsData = await fetchMainTopics();
        if (topicsData && topicsData.main_topics) {
          setMainTopics(topicsData.main_topics);
        }
      } catch (err) {
        console.error('Error loading filter options:', err);
        setError('Failed to load filter options');
      } finally {
        setIsLoading(false);
      }
    };

    loadFilterOptions();
  }, []);

  // Handle khanda selection
  const handleKhandaChange = (e) => {
    const khandaId = e.target.value ? parseInt(e.target.value, 10) : null;

    // Reset adhyaya selection if khanda changes
    onFilterChange({
      ...filters,
      khandaId,
      adhyayaId: null
    });
  };

  // Handle adhyaya selection
  const handleAdhyayaChange = (e) => {
    const adhyayaId = e.target.value ? parseInt(e.target.value, 10) : null;
    onFilterChange({
      ...filters,
      adhyayaId
    });
  };

  // Handle main topic selection
  const handleMainTopicChange = (e) => {
    const mainTopic = e.target.value || null;
    onFilterChange({
      ...filters,
      mainTopic
    });
  };

  // Toggle section expansion for mobile view
  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  // Get adhyayas for the selected khanda
  const getAdhyayasForSelectedKhanda = () => {
    if (!filters.khandaId) return [];

    const selectedKhanda = khandas.find(k => k.id === filters.khandaId);
    return selectedKhanda ? selectedKhanda.adhyayas || [] : [];
  };

  // Clear all filters
  const handleClearFilters = () => {
    onFilterChange({
      khandaId: null,
      adhyayaId: null,
      mainTopic: null,
      contextSize: 100 // Keep default context size
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex justify-center">
          <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-orange-700"></div>
          <span className="ml-2 text-orange-700">Loading filters...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="text-red-600">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-orange-700 underline mt-1"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const adhyayas = getAdhyayasForSelectedKhanda();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <h3 className="text-lg font-semibold text-orange-900 mb-4">Refine Search</h3>

      {/* Mobile accordion view */}
      <div className="md:hidden">
        {/* Location filter section */}
        <div className="mb-3 border border-orange-200 rounded-lg overflow-hidden">
          <button
            className="w-full px-4 py-2 bg-orange-50 text-left font-medium text-orange-800 flex justify-between items-center"
            onClick={() => toggleSection('location')}
          >
            <span>Location</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform ${expandedSection === 'location' ? 'transform rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedSection === 'location' && (
            <div className="p-4">
              <div className="mb-3">
                <label className="block text-sm text-orange-700 mb-1">Khanda</label>
                <select
                  value={filters.khandaId || ''}
                  onChange={handleKhandaChange}
                  className="w-full p-2 border border-orange-200 rounded bg-amber-50"
                >
                  <option value="">All Khandas</option>
                  {khandas.map(khanda => (
                    <option key={khanda.id} value={khanda.id}>
                      {khanda.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-orange-700 mb-1">Sarga</label>
                <select
                  value={filters.adhyayaId || ''}
                  onChange={handleAdhyayaChange}
                  disabled={!filters.khandaId}
                  className={`w-full p-2 border border-orange-200 rounded ${!filters.khandaId ? 'bg-gray-100 text-gray-500' : 'bg-amber-50'}`}
                >
                  <option value="">All Sargas</option>
                  {adhyayas.map(adhyaya => (
                    <option key={adhyaya.id} value={adhyaya.id}>
                      {adhyaya.id}. {adhyaya.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Main Topic filter section */}
        <div className="mb-3 border border-orange-200 rounded-lg overflow-hidden">
          <button
            className="w-full px-4 py-2 bg-orange-50 text-left font-medium text-orange-800 flex justify-between items-center"
            onClick={() => toggleSection('topic')}
          >
            <span>Topic</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 transition-transform ${expandedSection === 'topic' ? 'transform rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {expandedSection === 'topic' && (
            <div className="p-4">
              <label className="block text-sm text-orange-700 mb-1">Main Topic</label>
              <select
                value={filters.mainTopic || ''}
                onChange={handleMainTopicChange}
                className="w-full p-2 border border-orange-200 rounded bg-amber-50"
              >
                <option value="">All Topics</option>
                {mainTopics.map(topic => (
                  <option key={topic} value={topic}>
                    {topic}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Desktop view - all filters displayed at once */}
      <div className="hidden md:block">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Khanda filter */}
          <div>
            <label className="block text-sm text-orange-700 mb-1">Khanda</label>
            <select
              value={filters.khandaId || ''}
              onChange={handleKhandaChange}
              className="w-full p-2 border border-orange-200 rounded bg-amber-50"
            >
              <option value="">All Khandas</option>
              {khandas.map(khanda => (
                <option key={khanda.id} value={khanda.id}>
                  {khanda.name}
                </option>
              ))}
            </select>
          </div>

          {/* Adhyaya filter */}
          <div>
            <label className="block text-sm text-orange-700 mb-1">Sarga</label>
            <select
              value={filters.adhyayaId || ''}
              onChange={handleAdhyayaChange}
              disabled={!filters.khandaId}
              className={`w-full p-2 border border-orange-200 rounded ${!filters.khandaId ? 'bg-gray-100 text-gray-500' : 'bg-amber-50'}`}
            >
              <option value="">All Sargas</option>
              {adhyayas.map(adhyaya => (
                <option key={adhyaya.id} value={adhyaya.id}>
                  {adhyaya.id}. {adhyaya.title}
                </option>
              ))}
            </select>
          </div>

          {/* Main Topic filter */}
          <div>
            <label className="block text-sm text-orange-700 mb-1">Main Topic</label>
            <select
              value={filters.mainTopic || ''}
              onChange={handleMainTopicChange}
              className="w-full p-2 border border-orange-200 rounded bg-amber-50"
            >
              <option value="">All Topics</option>
              {mainTopics.map(topic => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-end space-x-3">
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 text-sm text-orange-700 border border-orange-300 rounded hover:bg-orange-50"
        >
          Clear Filters
        </button>
        <button
          onClick={() => onFilterChange(filters)}
          className="px-4 py-2 text-sm text-white bg-orange-700 rounded hover:bg-orange-800"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default RefineFilters;
