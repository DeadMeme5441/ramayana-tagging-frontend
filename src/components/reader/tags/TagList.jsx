import React, { useState, useEffect } from 'react';
import TagItem from './TagItem';

/**
 * Component for displaying categorized lists of tags
 *
 * @param {Object} props
 * @param {Object} props.categories - Object with categories as keys and arrays of tags as values
 * @param {string|null} props.activeTag - Currently selected tag name
 * @param {Object|null} props.tagDetails - Details for the active tag
 * @param {Function} props.onTagClick - Handler for when a tag is clicked
 */
const TagList = ({ categories, activeTag, tagDetails, onTagClick }) => {
  // Track expanded categories
  const [expandedCategories, setExpandedCategories] = useState({});

  // Auto-expand category containing active tag
  useEffect(() => {
    if (activeTag) {
      // Find which category contains the active tag
      Object.entries(categories).forEach(([category, tags]) => {
        if (tags.some(tag => tag.name === activeTag)) {
          setExpandedCategories(prev => ({
            ...prev,
            [category]: true
          }));
        }
      });
    }
  }, [activeTag, categories]);

  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Expand all categories
  const expandAll = () => {
    const expanded = {};
    Object.keys(categories).forEach(category => {
      expanded[category] = true;
    });
    setExpandedCategories(expanded);
  };

  // Collapse all categories
  const collapseAll = () => {
    const collapsed = {};
    Object.keys(categories).forEach(category => {
      collapsed[category] = false;
    });
    setExpandedCategories(collapsed);
  };

  return (
    <div className="space-y-2">
      {/* Expand/Collapse All buttons */}
      <div className="flex justify-between text-xs mb-2 px-2">
        <button 
          onClick={expandAll}
          className="text-orange-700 hover:text-orange-900 font-medium"
        >
          Expand All
        </button>
        <button 
          onClick={collapseAll}
          className="text-orange-700 hover:text-orange-900 font-medium"
        >
          Collapse All
        </button>
      </div>

      {Object.entries(categories).map(([category, tags]) => (
        <div key={category} className="mb-3 border border-orange-100 rounded overflow-hidden">
          {/* Category header */}
          <div
            className="font-medium text-orange-900 px-3 py-2 bg-orange-50 flex justify-between items-center cursor-pointer hover:bg-orange-100 transition-colors"
            onClick={() => toggleCategory(category)}
          >
            <div className="flex items-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 mr-1 transition-transform duration-200 ${expandedCategories[category] !== false ? 'transform rotate-90' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>{category}</span>
            </div>
            <span className="bg-orange-200 text-orange-800 text-xs px-2 py-0.5 rounded-full">{tags.length}</span>
          </div>

          {/* Show tags if category is expanded or not specified in state */}
          {(expandedCategories[category] !== false) && (
            <ul className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent">
              {tags.map(tag => (
                <TagItem
                  key={tag.name}
                  tag={tag}
                  isActive={activeTag === tag.name}
                  occurrences={activeTag === tag.name ? tagDetails?.occurrences : null}
                  onClick={onTagClick}
                />
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

export default TagList;
