import React, { useState } from 'react';

const SearchResultsPage = () => {
  // Dummy search query
  const searchQuery = "धर्मः";

  // Dummy search results grouped by category
  const searchResults = {
    'कथा': [
      {
        id: 1,
        tag: 'कथा;रामस्य धर्मः',
        snippet: '...राजा दशरथः पुत्रं श्रीरामं धर्मः प्रति उपदिशति। <mark class="bg-yellow-100">धर्मः सर्वस्य मूलम्, धर्मः सत्यस्य रक्षकः</mark>, धर्मः राज्ञः परमो धर्मः...',
        khanda: 'अयोध्याकाण्डम्',
        adhyaya: 12,
        position: 1243
      },
      {
        id: 2,
        tag: 'कथा;वनवासे धर्मः',
        snippet: '...वने निवसन् अपि श्रीरामः <mark class="bg-yellow-100">धर्मः न त्यजति</mark>। वनवासः अपि तस्य धर्मपालनस्य अवसरः एव।...',
        khanda: 'अरण्यकाण्डम्',
        adhyaya: 9,
        position: 892
      }
    ],
    'गुणः': [
      {
        id: 3,
        tag: 'गुणः;रामस्य धर्मप्रियता',
        snippet: '...नारदः वदति - रामः सर्वदा <mark class="bg-yellow-100">धर्मः अनुसरति</mark>, न कदापि स्वधर्मं त्यजति। धर्मज्ञः सत्यसन्धः च...',
        khanda: 'बालकाण्डम्',
        adhyaya: 1,
        position: 421
      },
      {
        id: 4,
        tag: 'गुणः;सीतायाः धर्मज्ञानम्',
        snippet: '...सीता अपि <mark class="bg-yellow-100">धर्मः विषये</mark> निपुणा आसीत्। पतिव्रता धर्मं पालयन्ती सा...',
        khanda: 'सुन्दरकाण्डम्',
        adhyaya: 15,
        position: 2134
      }
    ],
    'उपदेशः': [
      {
        id: 5,
        tag: 'उपदेशः;रामेण धर्मोपदेशः',
        snippet: '...तदा श्रीरामः उवाच - <mark class="bg-yellow-100">धर्मः एव हतो हन्ति धर्मो रक्षति रक्षितः</mark>। तस्मात् धर्मो न हन्तव्यो मा नो धर्मो हतोऽवधीत्...',
        khanda: 'युद्धकाण्डम्',
        adhyaya: 82,
        position: 3421
      }
    ]
  };

  // State for filters
  const [activeKhanda, setActiveKhanda] = useState('all');
  const [tagType, setTagType] = useState('all');

  // Dummy khandas for filter
  const khandas = [
    { id: 'all', name: 'All Khandas' },
    { id: 'बालकाण्डम्', name: 'बालकाण्डम्' },
    { id: 'अयोध्याकाण्डम्', name: 'अयोध्याकाण्डम्' },
    { id: 'अरण्यकाण्डम्', name: 'अरण्यकाण्डम्' },
    { id: 'किष्किन्धाकाण्डम्', name: 'किष्किन्धाकाण्डम्' },
    { id: 'सुन्दरकाण्डम्', name: 'सुन्दरकाण्डम्' },
    { id: 'युद्धकाण्डम्', name: 'युद्धकाण्डम्' },
    { id: 'उत्तरकाण्डम्', name: 'उत्तरकाण्डम्' },
  ];

  // Helper to count total results
  const getTotalResults = () => {
    return Object.values(searchResults).reduce((sum, results) => sum + results.length, 0);
  };

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-orange-900 text-amber-50 py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-serif font-bold">रामायण तत्त्वानुक्रमणिका</h1>
            <h2 className="text-lg">Ramayana Tagging Engine</h2>
          </div>

          {/* Search in header */}
          <div className="relative w-1/3">
            <input
              type="text"
              defaultValue={searchQuery}
              className="w-full px-4 py-2 rounded-full border-2 border-orange-300 focus:border-orange-500 focus:outline-none text-black"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-orange-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search information */}
        <div className="mb-6">
          <h2 className="text-2xl font-serif font-bold text-orange-900">
            Search Results: <span className="text-orange-700">{searchQuery}</span>
          </h2>
          <p className="text-orange-800">
            Found {getTotalResults()} results across {Object.keys(searchResults).length} categories
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8 flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-orange-700 mb-1">Filter by Khanda</label>
            <select
              value={activeKhanda}
              onChange={(e) => setActiveKhanda(e.target.value)}
              className="p-2 border border-orange-200 rounded-md bg-amber-50 text-orange-900"
            >
              {khandas.map(khanda => (
                <option key={khanda.id} value={khanda.id}>{khanda.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-orange-700 mb-1">Tag Type</label>
            <select
              value={tagType}
              onChange={(e) => setTagType(e.target.value)}
              className="p-2 border border-orange-200 rounded-md bg-amber-50 text-orange-900"
            >
              <option value="all">All Types</option>
              <option value="main">Main Topic</option>
              <option value="info">Subject Info</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-8">
          {Object.entries(searchResults).map(([category, results]) => (
            <div key={category} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-orange-100 px-4 py-3 border-l-4 border-orange-600">
                <h3 className="text-xl font-serif font-bold text-orange-900">{category}</h3>
                <p className="text-orange-700 text-sm">{results.length} results</p>
              </div>

              <div className="divide-y divide-orange-100">
                {results.map(result => (
                  <div key={result.id} className="p-4 hover:bg-amber-50 transition">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-orange-900">{result.tag}</h4>
                      <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                        {result.khanda} • Adhyaya {result.adhyaya}
                      </span>
                    </div>

                    <p
                      className="text-orange-800 bg-amber-50 p-3 rounded mb-3 font-serif"
                      dangerouslySetInnerHTML={{ __html: result.snippet }}
                    />

                    <button className="text-orange-600 hover:text-orange-800 font-medium text-sm flex items-center">
                      Jump to Adhyaya
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-orange-900 text-amber-50 py-4 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Ramayana Tagging Engine | Sanskrit Digital Humanities Project</p>
        </div>
      </footer>
    </div>
  );
};

export default SearchResultsPage;
