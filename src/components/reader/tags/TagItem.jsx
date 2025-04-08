import React from 'react';

/**
 * Component for displaying an individual tag in the sidebar
 *
 * @param {Object} props
 * @param {Object} props.tag - Tag data
 * @param {boolean} props.isActive - Whether this tag is currently active
 * @param {Function} props.onClick - Handler for when this tag is clicked
 */
const TagItem = ({ tag, isActive, onClick }) => {
  // Helper to get a display name for the tag
  const getDisplayName = () => {
    // If tag has subject info, use that as the display name
    if (tag.subject_info && tag.subject_info.length > 0) {
      return tag.subject_info.join(' • ');
    }

    // If tag name has a semicolon, it likely has a category prefix - strip it
    if (tag.name.includes(';')) {
      return tag.name.split(';')[1].trim();
    }

    // Otherwise use the full tag name
    return tag.name;
  };

  // Get the display name
  const displayName = getDisplayName();

  return (
    <li
      className={`py-1 px-2 text-sm cursor-pointer rounded ${
        isActive ? 'bg-orange-100 font-medium' : 'hover:bg-orange-50'
      }`}
      onClick={onClick}
    >
      <div className="truncate" title={displayName}>
        {displayName}
      </div>

      {/* If tag has additional info that's not shown in the display name, show it in smaller text */}
      {tag.name.includes(';') && tag.subject_info && tag.subject_info.length === 0 && (
        <div className="text-xs text-orange-600 truncate">
          {tag.name.split(';')[0].trim()}
        </div>
      )}
    </li>
  );
};

export default TagItem;
