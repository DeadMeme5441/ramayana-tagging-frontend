import React, { useState } from 'react';

/**
 * Component for displaying an individual tag in the sidebar
 *
 * @param {Object} props
 * @param {Object} props.tag - Tag data
 * @param {boolean} props.isActive - Whether this tag is currently active
 * @param {Array} props.occurrences - Occurrences of the tag in the text (if active)
 * @param {Function} props.onClick - Handler for when this tag is clicked
 */
const TagItem = ({ tag, isActive, occurrences, onClick }) => {
  // State for showing occurrences
  const [showOccurrences, setShowOccurrences] = useState(false);
  
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
  
  // Check if tag has occurrences
  const hasOccurrences = occurrences && occurrences.length > 0;
  
  // Ensure we have a valid array of occurrences to prevent errors
  const safeOccurrences = occurrences || [];
  
  // Handle tag click - click the tag and scroll to its first occurrence
  const handleTagClick = (e) => {
    e.stopPropagation();
    
    // If tag is already active, toggle showing occurrences
    if (isActive) {
      setShowOccurrences(!showOccurrences);
    } else {
      // Activate the tag and show occurrences
      onClick(tag.name);
      setShowOccurrences(true);
      
      // Add a small timeout to allow the tag to be highlighted first
      setTimeout(() => {
        // Create a custom event to trigger scrolling to the first highlighted element
        const scrollEvent = new CustomEvent('scrollToFirstHighlight');
        window.dispatchEvent(scrollEvent);
      }, 300);
    }
  };
  
  // Handle clicking on a specific occurrence
  const handleOccurrenceClick = (occurrence, index) => (e) => {
    e.stopPropagation();
    
    // Make sure the tag is active
    if (!isActive) {
      onClick(tag.name);
    }
    
    // Add index to the occurrence
    const occurrenceWithIndex = {
      ...occurrence,
      index
    };
    
    // Trigger scrolling to this specific occurrence
    setTimeout(() => {
      const scrollEvent = new CustomEvent('scrollToOccurrence', {
        detail: { occurrence: occurrenceWithIndex }
      });
      window.dispatchEvent(scrollEvent);
    }, 100);
  };

  return (
    <li className="border-b border-orange-50 last:border-b-0">
      <div
        className={`py-2 px-2 text-sm cursor-pointer ${
          isActive ? 'bg-orange-100 font-medium' : 'hover:bg-orange-50'
        } flex justify-between items-center`}
        onClick={handleTagClick}
      >
        <div className="flex-grow">
          <div className="truncate" title={displayName}>
            {displayName}
          </div>

          {/* If tag has additional info that's not shown in the display name, show it in smaller text */}
          {tag.name.includes(';') && tag.subject_info && tag.subject_info.length === 0 && (
            <div className="text-xs text-orange-600 truncate">
              {tag.name.split(';')[0].trim()}
            </div>
          )}
        </div>
        
        {/* Occurrence count badge if tag has occurrences */}
        {hasOccurrences && (
          <div className="flex items-center">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowOccurrences(!showOccurrences);
              }}
              className="text-xs bg-orange-200 rounded-full px-1.5 py-0.5 text-orange-800 ml-1 hover:bg-orange-300 flex items-center"
            >
              {safeOccurrences.length}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-3 w-3 ml-0.5 transition-transform duration-200 ${showOccurrences ? 'transform rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>
      
      {/* Show occurrences if expanded */}
      {isActive && showOccurrences && hasOccurrences && (
        <div className="bg-orange-50 p-1 text-xs">
          <div className="text-orange-700 px-1 py-0.5 mb-1">Occurrences:</div>
          <ul className="space-y-1 max-h-32 overflow-y-auto pl-2 pr-1">
            {safeOccurrences.map((occ, idx) => (
              <li 
                key={idx}
                onClick={handleOccurrenceClick(occ, idx)}
                className="cursor-pointer hover:bg-orange-100 rounded px-1 py-0.5 flex items-center"
              >
                <span className="w-5 h-5 flex items-center justify-center bg-orange-200 text-orange-800 rounded-full mr-1">
                  {idx + 1}
                </span>
                <span className="truncate">{occ.text || 'View occurrence'}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
};

export default TagItem;
