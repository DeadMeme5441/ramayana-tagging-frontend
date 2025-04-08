// src/components/search/SearchResultItem.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchResultItem = ({ result }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  // Helper to handle navigating to adhyaya
  const navigateToAdhyaya = (match) => {
    navigate(`/read/${match.khanda_id}/${match.adhyaya_id}`);
  };

  // Limit the displayed matches if there are many and not expanded
  const MAX_VISIBLE_MATCHES = 3;
  const displayedMatches = expanded
    ? result.matches
    : result.matches.slice(0, MAX_VISIBLE_MATCHES);

  // Count additional matches not shown
  const additionalMatches = result.matches.length - MAX_VISIBLE_MATCHES;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-orange-100 hover:shadow-md transition-shadow">
      <div className="bg-orange-50 px-4 py-3 border-b border-orange-100">
        <div className="flex justify-between items-start">
          <h3 className="font-serif font-bold text-orange-900 text-lg">
            {result.subject_info && result.subject_info.length > 0
              ? result.subject_info.join(' • ')
              : result.tag_name}
          </h3>
          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
            {result.match_count} occurrence{result.match_count !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Tag metadata - now showing only main topics with different styling */}
        <div className="mt-2 flex items-center">
          <span className="text-xs text-gray-500 mr-2">Tag:</span>
          <div className="flex flex-wrap gap-1">
            <span className="text-sm font-medium text-orange-800">{result.tag_name}</span>
          </div>
        </div>

        {/* Main topics */}
        {result.main_topics && result.main_topics.length > 0 && (
          <div className="mt-1 flex items-center flex-wrap">
            <span className="text-xs text-gray-500 mr-2">Categories:</span>
            <div className="flex flex-wrap gap-1">
              {result.main_topics.map((topic, idx) => (
                <span key={idx} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Match results */}
      <div className="divide-y divide-orange-100">
        {displayedMatches.map((match, idx) => (
          <div
            key={idx}
            className="p-4 hover:bg-amber-50 cursor-pointer"
            onClick={() => navigateToAdhyaya(match)}
          >
            <div className="flex justify-between mb-2">
              <span className="font-medium text-orange-800">
                {match.khanda_name} • Adhyaya {match.adhyaya_id}
              </span>
              <button
                className="text-orange-600 hover:text-orange-800 text-sm flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToAdhyaya(match);
                }}
              >
                View <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

            {/* Content snippet with context */}
            <div className="bg-amber-50 p-3 rounded text-orange-900 font-serif">
              <span className="text-orange-600">{match.before_text}</span>
              <span className="bg-yellow-200 px-0.5 font-bold">{match.match_text}</span>
              <span className="text-orange-600">{match.after_text}</span>
            </div>

            {/* Adhyaya title if available */}
            {match.adhyaya_title && (
              <div className="text-xs text-orange-700 mt-2">
                {match.adhyaya_title}
              </div>
            )}
          </div>
        ))}

        {/* Show more/less button if needed */}
        {additionalMatches > 0 && (
          <div className="px-4 py-2 bg-orange-50 border-t border-orange-100">
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full text-center text-orange-700 hover:text-orange-900 text-sm font-medium"
            >
              {expanded ? (
                <span>Show less</span>
              ) : (
                <span>Show {additionalMatches} more occurrence{additionalMatches !== 1 ? 's' : ''}</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultItem;
