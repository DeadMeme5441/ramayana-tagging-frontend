import React, { useState } from 'react';

const AdhyayaReader = () => {
  // Dummy state for currently displayed tag details
  const [activeTag, setActiveTag] = useState(null);

  // Dummy adhyaya data
  const adhyaya = {
    id: 12,
    khanda: "अयोध्याकाण्डम्",
    number: 12,
    title: "रामस्य वनगमनम्",
    prev: 11,
    next: 13
  };

  // Dummy tags present in this adhyaya
  const tagsInAdhyaya = {
    "कथा": [
      { id: 1, name: "कथा;रामस्य वनप्रस्थानम्", position: 345 },
      { id: 2, name: "कथा;नगरजनानां दुःखम्", position: 924 },
      { id: 3, name: "कथा;लक्ष्मणेन सह संवादः", position: 1824 }
    ],
    "संवादः": [
      { id: 4, name: "संवादः;दशरथेन सह", position: 412 },
      { id: 5, name: "संवादः;लक्ष्मणेन सह", position: 1678 }
    ],
    "धर्मः": [
      { id: 6, name: "धर्मः;पितृवचनपालनम्", position: 782 },
      { id: 7, name: "धर्मः;भ्रातृस्नेहः", position: 1532 }
    ],
    "पात्रम्": [
      { id: 8, name: "पात्रम्;रामः", position: 123 },
      { id: 9, name: "पात्रम्;लक्ष्मणः", position: 456 },
      { id: 10, name: "पात्रम्;कौसल्या", position: 789 }
    ]
  };

  // Dummy khanda data for navigation
  const khandas = [
    {
      id: 1,
      name: "बालकाण्डम्",
      adhyayas: [
        { number: 1, title: "नारदेन वाल्मीकये रामकथाकथनम्" },
        { number: 2, title: "गङ्गावतरणम्" },
        { number: 3, title: "अयोध्यावर्णनम्" }
      ]
    },
    {
      id: 2,
      name: "अयोध्याकाण्डम्",
      adhyayas: [
        { number: 10, title: "रामाभिषेकनिश्चयः" },
        { number: 11, title: "मन्थरायाः कुमन्त्रणा" },
        { number: 12, title: "रामस्य वनगमनम्", active: true },
        { number: 13, title: "दशरथविलापः" },
        { number: 14, title: "कौसल्याश्वासनम्" }
      ]
    },
    {
      id: 3,
      name: "अरण्यकाण्डम्",
      adhyayas: [
        { number: 1, title: "विराधवधः" },
        { number: 2, title: "शरभङ्गदर्शनम्" },
        { number: 3, title: "अगस्त्यमिलनम्" }
      ]
    }
  ];

  // Dummy data for tag details
  const tagDetails = {
    1: {
      name: "कथा;रामस्य वनप्रस्थानम्",
      category: "कथा",
      description: "This tag describes the narrative of Rama's departure to the forest.",
      occurrences: 3
    },
    4: {
      name: "संवादः;दशरथेन सह",
      category: "संवादः",
      description: "Dialogue between Rama and his father Dasharatha.",
      occurrences: 5
    },
    6: {
      name: "धर्मः;पितृवचनपालनम्",
      category: "धर्मः",
      description: "The dharma of obeying father's words, which Rama exemplifies.",
      occurrences: 8
    },
    8: {
      name: "पात्रम्;रामः",
      category: "पात्रम्",
      description: "Sections specifically focusing on Rama as a character.",
      occurrences: 145
    },
    10: {
      name: "पात्रम्;कौसल्या",
      category: "पात्रम्",
      description: "Sections focusing on Kausalya, Rama's mother.",
      occurrences: 32
    }
  };

  // Dummy text content with tags
  const contentWithTags = `
<div class="text-lg leading-relaxed font-serif">
  <p class="mb-4"><span class="bg-red-100 px-1 py-0.5 rounded" data-tag-id="8">ततो रामस्य दूताश्च सुमन्त्रप्रमुखा द्विजाः।<br/>
  समाजग्मुर्महाराज शासनं त्वभिपालयन्।</span></p>

  <p class="mb-4">ते तु तत्र समासीनं ददृशुर्मन्त्रिणः सभे।<br/>
  स्थितं मनुष्यसिंहस्य शासने पार्थिवस्य हि।</p>

  <p class="mb-4"><span class="bg-blue-100 px-1 py-0.5 rounded" data-tag-id="4">ततस्त्वभिगमं श्रुत्वा राजा दशरथस्तदा।<br/>
  प्रतीक्षमाणस्तान् दूतानिदं वचनमब्रवीत्।</span></p>

  <p class="mb-4">अह्वयध्वं स्वयं सर्वानिहोपस्थाप्यतां जनः।<br/>
  इत्युक्तवा वाक्यमाहूय उवाच द्विजसत्तमान्।</p>

  <p class="mb-4"><span class="bg-green-100 px-1 py-0.5 rounded" data-tag-id="6">अद्यैव रामं दृक्ष्यामि सह पत्न्या प्रमोदितः।<br/>
  प्रातश्चैवाभिषेक्ष्यामि धर्मज्ञं सत्यवादिनम्।</span></p>

  <p class="mb-4">ततो वचनमाज्ञाय राज्ञो दशरथस्य ते।<br/>
  त्वरिताः शीघ्रगामित्वाद् यथा शक्ति द्रुतं ययुः।</p>

  <p class="mb-4"><span class="bg-orange-100 px-1 py-0.5 rounded" data-tag-id="1">शीघ्रमानयतामित्येवं संदिशन्ति स्म ते जनाः।<br/>
  तेऽप्यास्थाय हयान् शीघ्रं यत्र रामस्य तं गृहम्।</span></p>

  <p class="mb-4">प्रतस्थुः शीघ्रगामित्वाद् राज्ञस्तु वचनार्थिनः।<br/>
  ते मत्वा राघवस्यार्थं आजग्मुस्तद्गृहं प्रति।</p>

  <p class="mb-4"><span class="bg-yellow-100 px-1 py-0.5 rounded" data-tag-id="10">स्थिताः कौसल्यगेहे तु ददृशुश्च परंतपम्।<br/>
  रामं राजकुमारं तु सिंहस्कन्धं महाबलम्।</span></p>

  <p class="mb-4">ततो निवेद्य रामाय दूतास्ते कृतकाञ्जलिः।<br/>
  ऊचुस्ते वचनं सर्वे यथोक्तं मृदु सौष्ठवम्।</p>

  <p class="mb-4"><span class="bg-purple-100 px-1 py-0.5 rounded" data-tag-id="5">पुत्रं दशरथो राजा द्रष्टुमिच्छति राघवम्।<br/>
  गच्छ त्वं पुरुषव्याघ्र वाक्यमेतन्निबोध मे।</span></p>
</div>
  `;

  // Handle tag click in content
  const handleTagClick = (tagId) => {
    setActiveTag(tagDetails[tagId]);
  };

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col">
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
              placeholder="Search tags..."
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

      <main className="flex-grow flex">
        {/* Left Sidebar - Navigation */}
        <div className="w-64 bg-white border-r border-orange-200 overflow-y-auto">
          <div className="p-4 border-b border-orange-200">
            <h3 className="font-bold text-orange-900">Navigation</h3>
          </div>

          <div className="p-2">
            {khandas.map(khanda => (
              <div key={khanda.id} className="mb-3">
                <div className="flex items-center px-2 py-1 cursor-pointer hover:bg-orange-50">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-orange-700 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {khanda.id === 2 ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    )}
                  </svg>
                  <span className="font-serif text-orange-900">{khanda.name}</span>
                </div>

                {khanda.id === 2 && (
                  <div className="pl-6 mt-1 border-l border-orange-200 ml-2">
                    {khanda.adhyayas.map(adhyaya => (
                      <div
                        key={adhyaya.number}
                        className={`py-1 px-2 text-sm cursor-pointer ${adhyaya.active ? 'bg-orange-100 text-orange-900 font-medium rounded' : 'text-orange-800 hover:bg-orange-50'}`}
                      >
                        {adhyaya.number}. {adhyaya.title}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow overflow-y-auto p-6">
          {/* Adhyaya Header */}
          <div className="mb-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-serif font-bold text-orange-900">
                {adhyaya.khanda} - अध्यायः {adhyaya.number}
              </h2>

              <div className="flex space-x-2">
                <button className="px-3 py-1 bg-orange-100 text-orange-800 rounded hover:bg-orange-200">
                  ← Previous
                </button>
                <button className="px-3 py-1 bg-orange-100 text-orange-800 rounded hover:bg-orange-200">
                  Next →
                </button>
              </div>
            </div>
            <h3 className="text-xl font-serif text-orange-800 mt-1">{adhyaya.title}</h3>
          </div>

          {/* Adhyaya Content with highlighted tags */}
          <div
            className="bg-white p-6 rounded-lg shadow-sm mb-6"
            dangerouslySetInnerHTML={{ __html: contentWithTags }}
            onClick={(e) => {
              const tagElement = e.target.closest('[data-tag-id]');
              if (tagElement) {
                const tagId = parseInt(tagElement.getAttribute('data-tag-id') || '0');
                handleTagClick(tagId);
              }
            }}
          />

          {/* Tag details panel (conditionally shown) */}
          {activeTag && (
            <div className="fixed bottom-0 left-64 right-64 bg-white border-t border-orange-200 shadow-lg p-4 transition-all duration-300 ease-in-out">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-serif font-bold text-orange-900">{activeTag.name}</h4>
                <button
                  onClick={() => setActiveTag(null)}
                  className="text-orange-500 hover:text-orange-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex gap-4">
                <div className="flex-grow">
                  <p className="text-orange-800 mb-2">{activeTag.description}</p>
                  <p className="text-sm text-orange-700">
                    Appears {activeTag.occurrences} times across Ramayana
                  </p>
                </div>

                <div>
                  <button className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700">
                    Search All Occurrences
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Tags List */}
        <div className="w-64 bg-white border-l border-orange-200 overflow-y-auto">
          <div className="p-4 border-b border-orange-200">
            <h3 className="font-bold text-orange-900">Tags in this Adhyaya</h3>
          </div>

          <div className="p-2">
            {Object.entries(tagsInAdhyaya).map(([category, tags]) => (
              <div key={category} className="mb-4">
                <h4 className="font-medium text-orange-900 px-2 py-1 bg-orange-50 mb-1 rounded">
                  {category}
                </h4>
                <ul className="pl-2">
                  {tags.map(tag => (
                    <li
                      key={tag.id}
                      className="py-1 px-2 text-sm cursor-pointer hover:bg-orange-50 rounded"
                      onClick={() => handleTagClick(tag.id)}
                    >
                      {tag.name.split(';')[1] || tag.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdhyayaReader;
