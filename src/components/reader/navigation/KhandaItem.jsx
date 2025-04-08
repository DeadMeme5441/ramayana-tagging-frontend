import React, { useState, useEffect } from 'react';

const KhandaItem = ({ khanda, isActive, currentAdhyayaId, onAdhyayaSelect }) => {
  // Track whether this khanda is expanded in the UI
  const [isExpanded, setIsExpanded] = useState(isActive);

  // When the active khanda changes, update expanded state
  useEffect(() => {
    if (isActive) {
      setIsExpanded(true);
    }
  }, [isActive]);

  // Toggle khanda expansion
  const toggleExpansion = () => {
    if (!isActive) {
      // If not the active khanda, navigate to its first adhyaya when expanding
      if (!isExpanded && khanda.adhyayas && khanda.adhyayas.length > 0) {
        onAdhyayaSelect(khanda.adhyayas[0].id);
      }
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mb-3">
      {/* Khanda header */}
      <div
        className="flex items-center px-2 py-1 cursor-pointer hover:bg-orange-50 rounded"
        onClick={toggleExpansion}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-orange-700 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isExpanded ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"}
          />
        </svg>
        <span className={`font-serif ${isActive ? 'text-orange-900 font-medium' : 'text-orange-800'}`}>
          {khanda.name}
        </span>
      </div>

      {/* Adhyayas list */}
      {isExpanded && (
        <div className="pl-6 mt-1 border-l border-orange-200 ml-2">
          {khanda.adhyayas.map(adhyaya => (
            <div
              key={adhyaya.id}
              onClick={() => onAdhyayaSelect(adhyaya.id)}
              className={`py-1 px-2 text-sm cursor-pointer rounded ${
                isActive && adhyaya.id === currentAdhyayaId
                  ? 'bg-orange-100 text-orange-900 font-medium'
                  : 'text-orange-800 hover:bg-orange-50'
              }`}
            >
              {adhyaya.id}. {adhyaya.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KhandaItem;
