import React, { useState } from 'react';

const TaggingExplanation = () => {
  const [activeTab, setActiveTab] = useState('about');

  // Example tags for demonstration
  const exampleTags = [
    {
      tag: 'कथा;नारदं प्रति वाल्मीकिमुनेः प्रश्नः',
      explanation: 'A narrative section about "Valmiki\'s question to Narada," categorized under "कथा" (story).'
    },
    {
      tag: 'धर्मः;दशरथस्य राज्यपालनम्',
      explanation: 'A section about "Dasharatha\'s rule of the kingdom," categorized under "धर्मः" (duty/righteousness).'
    },
    {
      tag: 'वर्णनम्;अयोध्यानगरम्',
      explanation: 'A description of "The city of Ayodhya," categorized under "वर्णनम्" (description).'
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-amber-50 to-orange-100">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-2xl font-serif font-bold text-orange-900 mb-6 text-center">
          Understanding the Tagging System
        </h2>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <nav className="flex space-x-2 bg-white rounded-lg p-1 shadow-sm border border-orange-200">
            <button
              onClick={() => setActiveTab('about')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'about'
                  ? 'bg-orange-600 text-white font-medium'
                  : 'text-orange-700 hover:bg-orange-50'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('structure')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'structure'
                  ? 'bg-orange-600 text-white font-medium'
                  : 'text-orange-700 hover:bg-orange-50'
              }`}
            >
              Structure
            </button>
            <button
              onClick={() => setActiveTab('examples')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'examples'
                  ? 'bg-orange-600 text-white font-medium'
                  : 'text-orange-700 hover:bg-orange-50'
              }`}
            >
              Examples
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white p-6 rounded-lg border border-orange-200 shadow-sm">
          {/* About Tab */}
          {activeTab === 'about' && (
            <div>
              <h3 className="text-xl font-serif font-bold text-orange-800 mb-4">About the Tagging Project</h3>
              <p className="text-orange-900 mb-4">
                The Ramayana Tagging Engine is a digital humanities project aimed at making the ancient
                Sanskrit epic more accessible for scholars, students, and enthusiasts by organizing the text 
                through a comprehensive semantic tagging system.
              </p>
              <p className="text-orange-900 mb-4">
                Unlike simple keyword searches, our tagging system identifies broader textual units
                that correspond to narrative elements, descriptions, philosophical discussions, and other
                important aspects of the text.
              </p>
              <p className="text-orange-900">
                This approach allows users to quickly locate all instances of specific themes, teachings,
                or narrative elements across the entire epic, facilitating deeper analysis and understanding
                of the Ramayana's complex structure and content.
              </p>
            </div>
          )}

          {/* Structure Tab */}
          {activeTab === 'structure' && (
            <div>
              <h3 className="text-xl font-serif font-bold text-orange-800 mb-4">Tag Structure</h3>
              <p className="text-orange-900 mb-4">
                Each tag in our system consists of two main components, separated by a semicolon:
              </p>
              
              <div className="mb-6 bg-orange-50 p-4 rounded border border-orange-200">
                <code className="block text-orange-800 font-mono font-medium">
                  &lt;Main Category;Subject Information&gt; ... &lt;/Main Category;Subject Information&gt;
                </code>
              </div>
              
              <dl className="space-y-4">
                <div>
                  <dt className="font-bold text-orange-800">Main Category:</dt>
                  <dd className="text-orange-900 ml-4">
                    A broad semantic classification (e.g., कथा/story, वर्णनम्/description, धर्मः/duty, etc.)
                    that identifies the type of content contained within the tag.
                  </dd>
                </div>
                
                <div>
                  <dt className="font-bold text-orange-800">Subject Information:</dt>
                  <dd className="text-orange-900 ml-4">
                    A more specific description of the content, providing details about the particular 
                    instance of the main category (e.g., "Ravana's description," "Rama's exile," etc.).
                  </dd>
                </div>
              </dl>
              
              <p className="mt-4 text-orange-900">
                This two-part structure allows for both broad categorization and specific identification,
                enabling precise textual navigation while maintaining a coherent organizational system.
              </p>
            </div>
          )}

          {/* Examples Tab */}
          {activeTab === 'examples' && (
            <div>
              <h3 className="text-xl font-serif font-bold text-orange-800 mb-4">Examples of Tags</h3>
              <p className="text-orange-900 mb-4">
                Below are examples of how our tagging system marks different types of content in the Ramayana:
              </p>
              
              <div className="space-y-4">
                {exampleTags.map((example, index) => (
                  <div key={index} className="bg-orange-50 p-4 rounded border border-orange-200">
                    <code className="block text-orange-800 font-mono mb-2">
                      &lt;{example.tag}&gt; ... &lt;/{example.tag}&gt;
                    </code>
                    <p className="text-orange-600 text-sm">{example.explanation}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 bg-orange-100 p-4 rounded-lg">
                <h4 className="font-bold text-orange-800 mb-2">Finding Tagged Content</h4>
                <p className="text-orange-700">
                  You can search for specific tags using the search bar at the top of the page. Try searching
                  for main categories like "कथा" or "धर्मः", or specific subject information like "रामः" or "सीता".
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TaggingExplanation;