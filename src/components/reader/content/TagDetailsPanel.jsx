import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Panel component for displaying detailed information about a selected tag
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the panel is open
 * @param {Object} props.tagDetails - Tag details data
 * @param {Function} props.onClose - Handler for closing the panel
 * @param {Function} props.onOccurrenceClick - Handler for clicking an occurrence
 */
const TagDetailsPanel = ({
  isOpen,
  tagDetails,
  onClose,
  onOccurrenceClick
}) => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  // Handle clicks outside the dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Find and hide dropdown
        const dropdown = document.querySelector('.dropdown > div');
        if (dropdown && !dropdown.classList.contains('hidden')) {
          dropdown.classList.add('hidden');
        }
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Don't render anything if the panel is closed or there are no tag details
  if (!isOpen || !tagDetails) {
    return null;
  }

  // Helper to generate an export file name
  const getExportFileName = () => {
    const tagName = tagDetails.tag_name.replace(/[^a-z0-9]/gi, '_');
    return `tag-${tagName}.txt`;
  };

  // Helper to generate exportable content
  const generateExportContent = () => {
    return `
Tag: ${tagDetails.tag_name}
${tagDetails.main_topics?.length ? 'Categories: ' + tagDetails.main_topics.join(', ') : ''}
${tagDetails.subject_info?.length ? 'Subject: ' + tagDetails.subject_info.join(' • ') : ''}
Occurrences: ${tagDetails.occurrences?.length || 0}
`.trim();
  };

  // Handle exporting tag information
  const handleExport = () => {
    const content = generateExportContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = getExportFileName();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 mx-auto max-w-5xl bg-white border-t border-orange-200 shadow-lg p-4 transition-all duration-300 ease-in-out rounded-t-lg z-20">
      <div className="flex justify-between items-start mb-3">
        {/* Subject info as main heading */}
        <div className="flex-grow">
          {tagDetails.subject_info && tagDetails.subject_info.length > 0 ? (
            <h4 className="font-serif font-bold text-orange-900 text-lg leading-tight">
              {tagDetails.subject_info.join(' • ')}
            </h4>
          ) : (
            <h4 className="font-serif font-bold text-orange-900 text-lg leading-tight">
              {tagDetails.tag_name}
            </h4>
          )}
          
          {/* Categories below */}
          {tagDetails.main_topics && tagDetails.main_topics.length > 0 && (
            <div className="mt-1 mb-2">
              {tagDetails.main_topics.map((topic, idx) => (
                <span key={idx} className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full mr-1 mb-1">
                  {topic}
                </span>
              ))}
            </div>
          )}
          
          {/* Tag name if not used as main heading */}
          {tagDetails.subject_info && tagDetails.subject_info.length > 0 && (
            <p className="text-sm text-orange-700 mt-1">
              Tag: <span className="font-medium">{tagDetails.tag_name}</span>
            </p>
          )}
        </div>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="ml-2 mt-1 text-orange-500 hover:text-orange-700 flex-shrink-0"
          aria-label="Close panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          {/* Occurrence count */}
          <p className="text-sm text-orange-700 mb-2">
            <span className="font-medium">{tagDetails.occurrences?.length || 0} occurrences</span> in this adhyaya
          </p>

          {/* Occurrences list - single line each */}
          {tagDetails.occurrences && tagDetails.occurrences.length > 0 && (
            <div className="max-h-36 overflow-y-auto bg-orange-50 rounded p-2">
              <ul className="divide-y divide-orange-100">
                {tagDetails.occurrences.map((occurrence, idx) => (
                  <li key={idx} className="py-1">
                    <button
                      className="text-left w-full text-sm hover:bg-orange-100 px-2 py-1 rounded text-orange-900 truncate"
                      onClick={() => {
                        setTimeout(() => onOccurrenceClick(occurrence), 100);
                      }}
                    >
                      <span className="font-medium text-xs mr-1">#{idx + 1}</span>
                      {occurrence.before_text && (
                        <span className="text-gray-500 text-xs">{occurrence.before_text.slice(-10)}</span>
                      )}
                      <span className="font-medium text-orange-800">
                        {occurrence.match_text ? occurrence.match_text.substring(0, 30) : "Jump to occurrence"}
                      </span>
                      {occurrence.after_text && (
                        <span className="text-gray-500 text-xs">{occurrence.after_text.slice(0, 10)}</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 md:w-auto flex-shrink-0">
          {/* Main heading search with dropdown */}
          <div className="relative dropdown" ref={dropdownRef}>
            <button
              className="px-3 py-1 bg-orange-100 text-orange-800 rounded hover:bg-orange-200 text-sm whitespace-nowrap w-full flex justify-between items-center"
              onClick={(e) => {
                // Toggle dropdown visibility
                const dropdown = e.currentTarget.nextElementSibling;
                if (dropdown) {
                  dropdown.classList.toggle('hidden');
                }
              }}
            >
              <span>Search Main Heading</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown for main headings */}
            <div className="absolute right-0 mt-1 bg-white shadow-md rounded-md overflow-hidden z-50 w-full hidden">
              {tagDetails.main_topics && tagDetails.main_topics.length > 0 ? (
                <div className="max-h-32 overflow-y-auto">
                  {tagDetails.main_topics.map((topic, idx) => (
                    <button
                      key={idx}
                      className="px-3 py-1.5 text-sm text-orange-800 hover:bg-orange-50 w-full text-left border-b border-orange-50 last:border-0"
                      onClick={() => {
                        navigate(`/search?q=${encodeURIComponent(topic)}`);
                        
                        // Close dropdown after selection
                        const dropdown = document.querySelector('.dropdown > div');
                        if (dropdown) {
                          dropdown.classList.add('hidden');
                        }
                      }}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              ) : (
                <button
                  className="px-3 py-1.5 text-sm text-orange-800 hover:bg-orange-50 w-full text-left"
                  onClick={() => {
                    navigate(`/search?q=${encodeURIComponent(tagDetails.tag_name)}`);
                    
                    // Close dropdown after selection
                    const dropdown = document.querySelector('.dropdown > div');
                    if (dropdown) {
                      dropdown.classList.add('hidden');
                    }
                  }}
                >
                  {tagDetails.tag_name}
                </button>
              )}
            </div>
          </div>

          <button
            className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm whitespace-nowrap"
            onClick={() => {
              // Handle search by subject
              const query = tagDetails.subject_info && tagDetails.subject_info.length > 0
                ? tagDetails.subject_info[0]
                : tagDetails.tag_name;
              navigate(`/search?q=${encodeURIComponent(query)}`);
            }}
          >
            Search Subject
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagDetailsPanel;
