import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

const KhaandasBrowser = () => {
  const navigate = useNavigate();
  const { khandas } = useAppContext();
  const [expandedKhanda, setExpandedKhanda] = useState(null);

  // Handle click on a kaanda
  const handleKhandaClick = (khandaId) => {
    if (expandedKhanda === khandaId) {
      setExpandedKhanda(null);
    } else {
      setExpandedKhanda(khandaId);
    }
  };

  // Navigate to specific sarga
  const handleAdhyayaClick = (khandaId, adhyayaId) => {
    navigate(`/read/${khandaId}/${adhyayaId}`);
  };

  // Calculate statistics for a kaanda
  const getKhandaStats = (kaanda) => {
    const adhyayaCount = kaanda.adhyayas?.length || 0;
    // This is a placeholder - in a real app, you'd fetch this data
    const tagCount = Math.floor(Math.random() * 200) + 100; // Just for demonstration
    
    return {
      adhyayaCount,
      tagCount,
    };
  };

  return (
    <>
      <h2 className="text-2xl font-serif font-bold text-orange-900 mb-4">
        Browse Khaandas
      </h2>
      <p className="text-orange-800 mb-6 text-sm">
        The Ramayana is divided into 7 kaandas (sections) containing sargas (chapters).
      </p>
      <br/>

      {/* Kaandas List */}
      <div className="space-y-3">
        {khandas && khandas.length > 0 ? (
          khandas.map((kaanda) => {
            const stats = getKhandaStats(kaanda);
            const isExpanded = expandedKhanda === kaanda.id;

            return (
              <div 
                key={kaanda.id}
                className="bg-white rounded-lg border border-orange-200 overflow-hidden hover:shadow-md transition"
              >
                <div 
                  className="px-5 py-4 bg-orange-100 cursor-pointer hover:bg-orange-200 transition"
                  onClick={() => handleKhandaClick(kaanda.id)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-serif font-bold text-orange-900 text-lg">{kaanda.name}</h3>
                    <div className="text-orange-700 hover:text-orange-900">
                      {isExpanded ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-orange-700 mt-1">
                    <span>{stats.adhyayaCount} Sargas</span>
                    <span>~{stats.tagCount} Tags</span>
                  </div>
                </div>

                {/* Expanded view with Sargas */}
                {isExpanded && kaanda.adhyayas && kaanda.adhyayas.length > 0 && (
                  <div className="p-4 bg-orange-50">
                    <div className="text-xs text-orange-700 mb-2">Sargas in this Kaanda:</div>
                    <div className="grid grid-cols-2 gap-2">
                      {kaanda.adhyayas.slice(0, 6).map((sarga) => (
                        <button
                          key={sarga.id}
                          onClick={() => handleAdhyayaClick(kaanda.id, sarga.id)}
                          className="px-3 py-2 bg-white text-orange-800 border border-orange-200 rounded-md font-serif text-sm hover:bg-orange-100 transition text-left truncate"
                        >
                          {sarga.id}. {sarga.title || `Sarga ${sarga.number}`}
                        </button>
                      ))}
                      {kaanda.adhyayas.length > 6 && (
                        <button
                          onClick={() => navigate(`/read/${kaanda.id}/1`)}
                          className="px-3 py-2 bg-orange-100 text-orange-800 border border-orange-300 rounded-md font-serif text-sm hover:bg-orange-200 transition text-center"
                        >
                          View all {kaanda.adhyayas.length} sargas...
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-orange-700 italic">
            No kaandas found. The database may be empty or still loading.
          </div>
        )}
      </div>
    </>
  );
};

export default KhaandasBrowser;
