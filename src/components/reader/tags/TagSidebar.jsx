import React, { useState, useEffect } from 'react';
import TagList from './TagList';

/**
 * Sidebar component for displaying and navigating tags in an adhyaya
 *
 * @param {Object} props
 * @param {Object} props.structuredTags - Tag data from the backend
 * @param {string|null} props.activeTag - Currently selected tag
 * @param {Object|null} props.tagDetails - Details for the active tag
 * @param {Function} props.onTagClick - Handler for when a tag is clicked
 */
const TagSidebar = ({ structuredTags, activeTag, tagDetails, onTagClick }) => {
  // Initialize search term as empty - don't use active tag
  const [searchTerm, setSearchTerm] = useState('');

  // Check if we have tags
  const hasCategories = structuredTags &&
    structuredTags.by_category &&
    Object.keys(structuredTags.by_category).length > 0;

  // Filter tags based on search term
  const filterTags = () => {
    if (!hasCategories || !searchTerm.trim()) {
      return structuredTags.by_category;
    }

    const term = searchTerm.toLowerCase();
    const filteredCategories = {};

    Object.entries(structuredTags.by_category).forEach(([category, tags]) => {
      // Filter tags that match the search term
      const matchingTags = tags.filter(tag => {
        // Check tag name
        if (tag.name.toLowerCase().includes(term)) {
          return true;
        }

        // Check subject info
        if (tag.subject_info && tag.subject_info.some(info =>
          info.toLowerCase().includes(term)
        )) {
          return true;
        }

        return false;
      });

      // Add category if it has matching tags
      if (matchingTags.length > 0) {
        filteredCategories[category] = matchingTags;
      }
    });

    return filteredCategories;
  };

  // Get filtered categories
  const filteredCategories = hasCategories ? filterTags() : {};

  return (
    <div className="w-80 bg-white border-l border-orange-200 overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-orange-200">
        <h3 className="font-bold text-orange-900 text-lg">Tags in this Sarga</h3>

        {/* Search input */}
        <div className="mt-2 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter tags..."
            className="w-full px-3 py-1 text-sm border border-orange-200 rounded focus:outline-none focus:ring-1 focus:ring-orange-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-orange-400 hover:text-orange-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Tag list with overflow scrolling */}
      <div className="p-2 overflow-y-auto flex-grow">
        {hasCategories ? (
          Object.keys(filteredCategories).length > 0 ? (
            <TagList
              categories={filteredCategories}
              activeTag={activeTag}
              tagDetails={tagDetails}
              onTagClick={onTagClick}
            />
          ) : (
            <div className="p-4 text-center text-orange-700 italic">
              No tags match your filter
            </div>
          )
        ) : (
          <div className="p-4 text-center text-orange-700 italic">
            No tags found in this sarga
          </div>
        )}
      </div>
    </div>
  );
};

export default TagSidebar;
