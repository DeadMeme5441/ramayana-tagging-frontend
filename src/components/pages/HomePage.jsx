import React from 'react';

const HomePage = () => {
  // Dummy data for popular tags
  const popularTags = [
    { id: 1, name: 'कथा', count: 245, category: 'main' },
    { id: 2, name: 'गुणः', count: 187, category: 'main' },
    { id: 3, name: 'राज्यम्', count: 142, category: 'main' },
    { id: 4, name: 'पात्रम्', count: 136, category: 'main' },
    { id: 5, name: 'धर्मः', count: 129, category: 'main' },
    { id: 6, name: 'युद्धम्', count: 118, category: 'main' },
    { id: 7, name: 'वनवासः', count: 94, category: 'info' },
    { id: 8, name: 'भक्तिः', count: 87, category: 'main' },
    { id: 9, name: 'श्रीराम', count: 82, category: 'info' },
    { id: 10, name: 'अयोध्या', count: 75, category: 'info' },
  ];

  // Dummy data for khandas
  const khandas = [
    { id: 1, name: 'बालकाण्डम्', adhyayas: 77 },
    { id: 2, name: 'अयोध्याकाण्डम्', adhyayas: 119 },
    { id: 3, name: 'अरण्यकाण्डम्', adhyayas: 75 },
    { id: 4, name: 'किष्किन्धाकाण्डम्', adhyayas: 67 },
    { id: 5, name: 'सुन्दरकाण्डम्', adhyayas: 68 },
    { id: 6, name: 'युद्धकाण्डम्', adhyayas: 128 },
    { id: 7, name: 'उत्तरकाण्डम्', adhyayas: 111 },
  ];

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <header className="bg-orange-900 text-amber-50 py-4 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-serif font-bold">रामायण तत्त्वानुक्रमणिका</h1>
          <h2 className="text-xl">Ramayana Tagging Engine</h2>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-orange-900 mb-4">
            Explore the Ramayana through its Tags
          </h2>
          <p className="text-orange-800 mb-8 max-w-2xl mx-auto">
            Search and navigate through the epics using a comprehensive tagging system
            that identifies key concepts, characters, events, and teachings.
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for tags like कथा, धर्मः, or श्रीराम..."
              className="w-full px-6 py-3 rounded-full border-2 border-orange-300 focus:border-orange-500 focus:outline-none text-lg shadow-sm"
            />
            <button className="absolute right-2 top-2 bg-orange-700 text-white p-2 rounded-full hover:bg-orange-800 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Popular Tags */}
        <div className="mb-16">
          <h3 className="text-xl font-serif font-bold text-orange-800 mb-4">Most Frequent Tags</h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map(tag => (
              <button
                key={tag.id}
                className="px-4 py-2 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 transition font-serif"
              >
                {tag.name} <span className="text-sm text-orange-600">({tag.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Khandas Navigation */}
        <div>
          <h3 className="text-xl font-serif font-bold text-orange-800 mb-4">Browse by Khanda</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {khandas.map(khanda => (
              <div key={khanda.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-600 hover:shadow-lg transition">
                <h4 className="text-lg font-serif font-bold text-orange-900 mb-2">{khanda.name}</h4>
                <p className="text-orange-700">{khanda.adhyayas} adhyayas</p>
                <button className="mt-3 text-orange-600 hover:text-orange-800 font-medium">
                  Explore {khanda.id === 1 ? 'Bala Kanda' : '→'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tagging System Explanation */}
        <div className="mt-16 bg-orange-50 p-6 rounded-lg border border-orange-200">
          <h3 className="text-xl font-serif font-bold text-orange-800 mb-3">About the Tagging System</h3>
          <p className="text-orange-700 mb-4">
            Our tagging system divides the Ramayana into semantic categories that help identify themes, concepts,
            and narratives throughout the text. Each tag consists of a main category and subject information.
          </p>
          <div className="bg-white p-4 rounded border border-orange-200">
            <code className="block text-sm text-orange-800 font-mono">
              &lt;कथा;नारदं प्रति वाल्मीकिमुनेः प्रश्नः&gt; ... &lt;/कथा;नारदं प्रति वाल्मीकिमुनेः प्रश्नः&gt;
            </code>
            <p className="mt-2 text-sm text-orange-600">
              This tag marks a narrative section about "Valmiki's question to Narada," categorized under "कथा" (story).
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-orange-900 text-amber-50 py-4 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Ramayana Tagging Engine | Sanskrit Digital Humanities Project</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
