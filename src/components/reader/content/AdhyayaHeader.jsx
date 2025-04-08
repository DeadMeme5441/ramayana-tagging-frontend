import React from 'react';

const SargaHeader = ({
  adhyayaContent: sargaContent,
  khandaId,
  adhyayaId,
  activeTag,
  onClearActiveTag,
  onNavigate
}) => {
  // Get kaanda name from content or generate a fallback
  const kaandaName = sargaContent?.khanda_name || `Kaanda ${khandaId}`;

  // Get sarga title or generate a fallback
  const sargaTitle = sargaContent?.title || `Sarga ${adhyayaId}`;

  // Get previous and next sarga titles/numbers
  const prevTitle = sargaContent?.navigation?.previous?.title || 
                  (sargaContent?.navigation?.previous ? `सर्गः ${sargaContent.navigation.previous.adhyaya_id}` : '');
  
  const nextTitle = sargaContent?.navigation?.next?.title || 
                  (sargaContent?.navigation?.next ? `सर्गः ${sargaContent.navigation.next.adhyaya_id}` : '');

  return (
    <div className="mb-6">      
      <div className="flex items-center w-full">
        {/* Previous button - left */}
        <button
          className={`flex-shrink-0 px-3 py-1 bg-orange-100 text-orange-800 rounded hover:bg-orange-200 flex items-center ${
            !sargaContent?.navigation?.previous ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={() => onNavigate('previous')}
          disabled={!sargaContent?.navigation?.previous}
          aria-label="Previous sarga"
        >
          <span className="mr-1">←</span>
          <span className="max-w-[100px] truncate hidden sm:inline">{prevTitle}</span>
        </button>

        {/* Title - center */}
        <div className="flex-grow text-center mx-4">
          <h2 className="text-3xl font-serif font-bold text-orange-900">
            ॥ श्रीमद्वाल्मीकीयरामायणम् ॥
          </h2>
          <h2 className="text-2xl font-serif font-bold text-orange-900">
            ॥ {kaandaName} ॥
          </h2>
          <h3 className="text-xl font-serif text-orange-800 mt-1">
            ॥ {sargaTitle} ॥
          </h3>
        </div>

        {/* Next button - right */}
        <button
          className={`flex-shrink-0 px-3 py-1 bg-orange-100 text-orange-800 rounded hover:bg-orange-200 flex items-center ${
            !sargaContent?.navigation?.next ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={() => onNavigate('next')}
          disabled={!sargaContent?.navigation?.next}
          aria-label="Next sarga"
        >
          <span className="max-w-[100px] truncate hidden sm:inline">{nextTitle}</span>
          <span className="ml-1">→</span>
        </button>
      </div>

      {/* Active tag indicator */}
      {activeTag && (
        <div className="mt-2 bg-amber-200 px-3 py-1 rounded-md inline-flex items-center">
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

export default SargaHeader;
