import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const SearchResultItem = ({ result }) => {
  const navigate = useNavigate();
  const { 
    setActiveAdhyaya, 
    setActiveTag, 
    setTagDetailsForAdhyaya 
  } = useAppContext();
  
  // Track expanded state for both the details panel and content
  const [expanded, setExpanded] = useState(false);
  const [expandedContent, setExpandedContent] = useState({});
  

  // Helper function to format and display content with proper formatting
  const formatContent = (beforeText, matchText, afterText, isExpanded) => {
    // Function to clean and normalize text
    const cleanAndNormalizeText = (text) => {
      if (!text) return '';
      
      // First remove all HTML tags
      let cleaned = text.replace(/<[^>]+>/g, '');
      
      // Replace multiple newlines with single newlines
      cleaned = cleaned.replace(/\n\s*\n/g, '\n');
      
      // Trim any leading/trailing whitespace
      return cleaned.trim();
    };
    
    // Clean and normalize all text parts
    const cleanedBefore = cleanAndNormalizeText(beforeText);
    const cleanedMatch = cleanAndNormalizeText(matchText);
    const cleanedAfter = cleanAndNormalizeText(afterText);
    
    // Get all lines from the combined content
    const allLines = (cleanedBefore + '\n' + cleanedMatch + '\n' + cleanedAfter)
      .split('\n')
      .filter(line => line.trim() !== ''); // Remove empty lines
    
    // Limit lines based on expanded state
    const displayLines = isExpanded ? allLines : allLines.slice(0, 4);
    const hasMoreLines = allLines.length > displayLines.length;
    
    // Function to highlight the match in text
    const highlightMatchInLine = (line) => {
      if (line.includes(cleanedMatch)) {
        const parts = line.split(cleanedMatch);
        return (
          <>
            {parts[0]}
            <span className="bg-yellow-100 px-0.5 font-bold">{cleanedMatch}</span>
            {parts.slice(1).join(cleanedMatch)}
          </>
        );
      }
      return line;
    };
    
    return (
      <div className="text-orange-700 pr-6"> {/* Added right padding for the button */}
        {/* Format with fixed structure */}
        <div>
          {/* Ellipses before the text */}
          <span className="text-orange-400">...</span>
          
          {/* Display lines with highlighting for the match */}
          <div className="mt-1 mb-1">
            {displayLines.map((line, i) => (
              <div key={i} className="py-0.5">
                {highlightMatchInLine(line)}
              </div>
            ))}
          </div>
          
          {/* Ellipses after the text (if more content) */}
          <span className="text-orange-400">{hasMoreLines ? "..." : ""}</span>
          
        </div>
      </div>
    );
  };

  // Helper to handle navigating to sarga
  const navigateToAdhyaya = (match) => {
    // Create a simple occurrence object from match data
    const occurrence = {
      position: 0,
      text: match.match_text || "",
      index: 0,
      // Add any additional data from the match that might be helpful
      context: match.before_text 
        ? match.before_text.slice(-50) + match.match_text + (match.after_text ? match.after_text.slice(0, 50) : "")
        : ""
    };
    
    // Prepare tag details from search results
    const tagDetails = {
      tag_name: result.tag_name,
      subject_info: result.subject_info || [],
      main_topics: result.main_topics || [],
      occurrences: [occurrence],
    };
    
    // Store tag details for this specific adhyaya
    setTagDetailsForAdhyaya(match.khanda_id, match.adhyaya_id, tagDetails);
    
    // Set the active tag in context AFTER setting tag details
    setActiveTag(result.tag_name);
    
    // Finally set the active khanda and adhyaya (which will trigger loading in the reader)
    setActiveAdhyaya(match.khanda_id, match.adhyaya_id);
    
    // Navigate to sarga without query parameters
    navigate(
      `/read/${match.khanda_id}/${match.adhyaya_id}`, 
      { replace: true }
    );
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
        {/* Display subject info as the primary header, or tag name if no subject info */}
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

        {/* Display Tag Name */}
        <div className="mt-2 flex items-center">
          <span className="text-xs text-gray-500 mr-2">Tag:</span>
          <div className="flex flex-wrap gap-1">
            <span className="text-sm font-medium text-orange-800">{result.tag_name}</span>
          </div>
        </div>

        {/* Display Main Topics as Categories */}
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
                {match.khanda_name} • Sarga {match.adhyaya_id}
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

            {/* Content snippet with context - formatted and collapsible */}
            <div className="bg-amber-50 p-3 rounded text-orange-900 font-serif relative">
              {formatContent(match.before_text, match.match_text, match.after_text, expandedContent[idx])}
              
              {/* Toggle button for expanding/collapsing */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedContent(prev => ({
                    ...prev,
                    [idx]: !prev[idx]
                  }));
                }}
                className="absolute top-3 right-3 text-orange-500 hover:text-orange-700"
              >
                {expandedContent[idx] ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
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
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
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
