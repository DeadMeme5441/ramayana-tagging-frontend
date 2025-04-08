import React from 'react';
import { useAppContext } from '../../context/AppContext';

// Import our components
import HeroSection from './HeroSection';
import KhaandasBrowser from './KhaandasBrowser';
import SemanticsBreakdown from './SemanticsBreakdown';
import TaggingExplanation from './TaggingExplanation';

const HomePage = () => {
  const { uiState, khandas } = useAppContext();

  // Render loading state for the entire page if khandas are loading
  if (uiState.isLoading && khandas.length === 0) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-900 mb-4"></div>
          <p className="text-orange-900 text-xl">Loading Ramayana Tagging Engine...</p>
        </div>
      </div>
    );
  }

  // Render error state if there's a global error
  if (uiState.error) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center bg-red-50 p-6 rounded-lg shadow-md max-w-md">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Data</h2>
          <p className="text-red-700 mb-4">{uiState.error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-orange-700 text-white rounded-lg hover:bg-orange-800"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero Section with Search */}
      <HeroSection />
      
      {/* Two-column layout for Khaandas and Semantic Categories */}
      <section className="bg-amber-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left column - Khaandas Browser */}
            <div>
              <KhaandasBrowser />
            </div>
            
            {/* Right column - Semantic Categories */}
            <div>
              <SemanticsBreakdown />
            </div>
          </div>
        </div>
      </section>
      
      {/* Tagging System Explanation */}
      <TaggingExplanation />
      
      {/* Footer */}
      <footer className="bg-orange-900 text-amber-50 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">© 2025 Ramayana Tagging Engine | Sanskrit Digital Humanities Project</p>
          <div className="flex justify-center space-x-4 mt-3">
            <a href="#" className="text-amber-200 hover:text-white">About</a>
            <a href="#" className="text-amber-200 hover:text-white">Contact</a>
            <a href="#" className="text-amber-200 hover:text-white">Documentation</a>
            <a href="#" className="text-amber-200 hover:text-white">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;