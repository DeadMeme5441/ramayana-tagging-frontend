import React from 'react';

const AdhyayaHeader = ({
  adhyayaContent,
  khandaId,
  adhyayaId,
  activeTag,
  onClearActiveTag,
  onNavigate
}) => {
  // Get khanda name from content or generate a fallback
  const khandaName = adhyayaContent?.khanda_name || `Khanda ${khandaId}`;

  // Get adhyaya title or generate a fallback
  const adhyayaTitle = adhyayaContent?.title || `Adhyaya ${adhyayaId}`;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold text-orange-900">
          {khandaName} - अध्यायः {adhyayaId}
        </h2>

        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 bg-orange-100 text-orange-800 rounded hover:bg-orange-200 ${
              !adhyayaContent?.navigation?.previous ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => onNavigate('previous')}
            disabled={!adhyayaContent?.navigation?.previous}
            aria-label="Previous adhyaya"
          >
            ← Previous
          </button>
          <button
            className={`px-3 py-1 bg-orange-100 text-orange-800 rounded hover:bg-orange-200 ${
              !adhyayaContent?.navigation?.next ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={() => onNavigate('next')}
            disabled={!adhyayaContent?.navigation?.next}
            aria-label="Next adhyaya"
          >
            Next →
          </button>
        </div>
      </div>

      <h3 className="text-xl font-serif text-orange-800 mt-1">
        {adhyayaTitle}
      </h3>

      {/* Active tag indicator */}
      {activeTag && (
        <div className="mt-2 bg-amber-100 px-3 py-1 rounded-md inline-flex items-center">
          <span className="text-orange-800 font-medium mr-2">Active tag: {activeTag}</span>
          <button
            onClick={onClearActiveTag}
            className="text-orange-600 hover:text-orange-800"
            aria-label="Clear active tag"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default AdhyayaHeader;
