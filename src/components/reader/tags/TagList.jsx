import React, { useState } from 'react';
import TagItem from './TagItem';

/**
 * Component for displaying categorized lists of tags
 *
 * @param {Object} props
 * @param {Object} props.categories - Object with categories as keys and arrays of tags as values
 * @param {string|null} props.activeTag - Currently selected tag name
 * @param {Function} props.onTagClick - Handler for when a tag is clicked
 */
const TagList = ({ categories, activeTag, onTagClick }) => {
  // Track expanded categories
  const [expandedCategories, setExpandedCategories] = useState({});

  // Toggle category expansion
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div className="space-y-4">
      {Object.entries(categories).map(([category, tags]) => (
        <div key={category} className="mb-4">
          {/* Category header */}
          <div
            className="font-medium text-orange-900 px-2 py-1 bg-orange-50 mb-1 rounded flex justify-between items-center cursor-pointer"
            onClick={() => toggleCategory(category)}
          >
            <span>{category}</span>
            <span className="text-xs text-orange-700">{tags.length}</span>
          </div>

          {/* Show tags if category is expanded or not specified in state */}
          {(expandedCategories[category] !== false) && (
            <ul className="pl-2">
              {tags.map(tag => (
                <TagItem
                  key={tag.name}
                  tag={tag}
                  isActive={activeTag === tag.name}
                  onClick={() => onTagClick(tag.name)}
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
