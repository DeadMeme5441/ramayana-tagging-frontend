import React from 'react';
import { useNavigate } from 'react-router-dom';
import KhandaItem from './KhandaItem';

const NavigationSidebar = ({
  khandas,
  currentKhandaId,
  currentAdhyayaId,
  isOpen,
  onToggle
}) => {
  const navigate = useNavigate();

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
    <div className="w-64 bg-white border-r border-orange-200 transition-all duration-300">
      <div className="p-4 border-b border-orange-200 flex justify-between items-center">
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

      <div className="p-2 overflow-y-auto max-h-[calc(100vh-10rem)]">
        {khandas.map(khanda => (
          <KhandaItem
            key={khanda.id}
            khanda={khanda}
            isActive={khanda.id === currentKhandaId}
            currentAdhyayaId={currentAdhyayaId}
            onAdhyayaSelect={(adhyayaId) => navigate(`/read/${khanda.id}/${adhyayaId}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default NavigationSidebar;
