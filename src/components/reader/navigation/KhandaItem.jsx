import React from 'react';

const KaandaItem = ({ 
  khanda: kaanda, 
  isActive, 
  currentAdhyayaId: currentSargaId, 
  onAdhyayaSelect: onSargaSelect,
  isExpanded,
  onToggleExpand 
}) => {
  // Toggle kaanda expansion
  const toggleExpansion = () => {
    // If not expanded and not the active kaanda, navigate to its first sarga
    if (!isExpanded && !isActive) {
      if (kaanda.adhyayas && kaanda.adhyayas.length > 0) {
        onSargaSelect(kaanda.adhyayas[0].id);
      }
    }
    // Call parent's toggle function with this kaanda's ID
    onToggleExpand(kaanda.id);
  };

  return (
    <div className="mb-2 border border-transparent rounded overflow-hidden hover:border-orange-100 transition-colors">
      {/* Kaanda header */}
      <div
        className={`flex items-center px-2 py-2 cursor-pointer ${isActive ? 'bg-orange-50' : 'hover:bg-orange-50'} ${isExpanded ? 'border-b border-orange-100' : ''}`}
        onClick={toggleExpansion}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 mr-1 transition-transform duration-200 ${isExpanded ? 'transform rotate-90' : ''} ${isActive ? 'text-orange-700' : 'text-orange-500'}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span className={`font-serif truncate ${isActive ? 'text-orange-900 font-medium' : 'text-orange-800'}`}>
          {kaanda.name}
        </span>
        {/* Sarga count badge */}
        <span className="ml-auto bg-orange-100 text-orange-800 text-xs rounded-full px-2 py-0.5">
          {kaanda.adhyayas.length}
        </span>
      </div>

      {/* Sargas list */}
      {isExpanded && (
        <div className={`pl-4 ${isActive ? 'bg-orange-50/50' : ''}`}>
          <div className="max-h-40 overflow-y-auto pr-1 my-1 scrollbar-thin scrollbar-thumb-orange-200 scrollbar-track-transparent hover:scrollbar-thumb-orange-300">
            {kaanda.adhyayas.map(sarga => (
              <div
                key={sarga.id}
                onClick={() => onSargaSelect(sarga.id)}
                className={`py-1 px-2 text-sm cursor-pointer rounded my-0.5 truncate ${
                  isActive && sarga.id === currentSargaId
                    ? 'bg-orange-200 text-orange-900 font-medium'
                    : 'text-orange-800 hover:bg-orange-100'
                }`}
              >
                <span className="inline-block w-5 text-right mr-1 text-orange-500">{sarga.id}.</span> {sarga.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KaandaItem;
