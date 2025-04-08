import React from 'react';

const EmptySearchState = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm text-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-orange-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <h3 className="text-xl font-serif font-bold text-orange-800 mb-2">Begin Your Search</h3>
      <p className="text-orange-700 mb-6 max-w-md mx-auto">
        Enter a tag name or topic to search through the Ramayana corpus.
        Try searching for tags like "कथा", "धर्मः", or character names.
      </p>
      <div className="flex justify-center space-x-3">
        <div className="inline-block bg-orange-50 px-3 py-2 text-sm text-orange-700 rounded-lg">
          <span className="font-bold">Example:</span> कथा
        </div>
        <div className="inline-block bg-orange-50 px-3 py-2 text-sm text-orange-700 rounded-lg">
          <span className="font-bold">Example:</span> धर्मः
        </div>
        <div className="inline-block bg-orange-50 px-3 py-2 text-sm text-orange-700 rounded-lg">
          <span className="font-bold">Example:</span> श्रीराम
        </div>
      </div>
    </div>
  );
};

export default EmptySearchState;