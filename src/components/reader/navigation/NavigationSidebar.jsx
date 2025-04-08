import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import KaandaItem from './KhandaItem';

const NavigationSidebar = ({
  khandas,
  currentKhandaId,
  currentAdhyayaId,
  isOpen,
  onToggle
}) => {
  const navigate = useNavigate();
  // Track which khandas are expanded
  const [expandedKhandas, setExpandedKhandas] = useState({});
  
  // Initialize with current kaanda expanded
  useEffect(() => {
    if (currentKhandaId) {
      setExpandedKhandas(prev => ({
        ...prev,
        [currentKhandaId]: true
      }));
    }
  }, [currentKhandaId]);

  // Toggle expansion of a kaanda
  const handleToggleExpand = (kaandaId) => {
    setExpandedKhandas(prev => ({
      ...prev,
      [kaandaId]: !prev[kaandaId]
    }));
  };

  // Expand all khandas
  const expandAll = () => {
    const expanded = {};
    khandas.forEach(kaanda => {
      expanded[kaanda.id] = true;
    });
    setExpandedKhandas(expanded);
  };

  // Collapse all khandas except the current one
  const collapseAll = () => {
    const expanded = {};
    if (currentKhandaId) {
      expanded[currentKhandaId] = true;
    }
    setExpandedKhandas(expanded);
  };

  // If sidebar is closed, only show the toggle button
  if (!isOpen) {
    return (
      <button
        className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-orange-100 p-2 rounded-r-md shadow-md z-10 text-orange-700 hover:bg-orange-200"
        onClick={onToggle}
        aria-label="Open navigation"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );
  }

  return (
    <div className="w-64 bg-white border-r border-orange-200 transition-all duration-300 flex flex-col h-full">
      <div className="p-4 border-b border-orange-200 flex justify-between items-center flex-shrink-0">
        <h3 className="font-bold text-orange-900">Navigation</h3>
        <button
          onClick={onToggle}
          className="text-orange-500 hover:text-orange-700"
          aria-label="Close navigation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      {/* Expand/Collapse buttons */}
      <div className="px-3 py-2 flex justify-between border-b border-orange-200 bg-orange-50/50 flex-shrink-0">
        <button 
          onClick={expandAll}
          className="text-orange-700 hover:text-orange-900 text-xs font-medium flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11l7-7 7 7M5 19l7-7 7 7" />
          </svg>
          Expand All
        </button>
        <button 
          onClick={collapseAll}
          className="text-orange-700 hover:text-orange-900 text-xs font-medium flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7M19 15l-7 7-7-7" />
          </svg>
          Collapse All
        </button>
      </div>

      <div className="px-2 py-2 overflow-y-auto flex-grow">
        <div className="space-y-1">
          {khandas.map(kaanda => (
            <KaandaItem
              key={kaanda.id}
              khanda={kaanda}
              isActive={kaanda.id === currentKhandaId}
              isExpanded={!!expandedKhandas[kaanda.id]}
              onToggleExpand={handleToggleExpand}
              currentAdhyayaId={currentAdhyayaId}
              onAdhyayaSelect={(adhyayaId) => navigate(`/read/${kaanda.id}/${adhyayaId}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NavigationSidebar;
