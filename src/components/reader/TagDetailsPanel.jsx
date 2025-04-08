import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Panel component for displaying detailed information about a selected tag
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the panel is open
 * @param {Object} props.tagDetails - Tag details data
 * @param {Function} props.onClose - Handler for closing the panel
 * @param {Function} props.onOccurrenceClick - Handler for clicking an occurrence
 */
const TagDetailsPanel = ({
  isOpen,
  tagDetails,
  onClose,
  onOccurrenceClick
}) => {
  const navigate = useNavigate();

  if (!isOpen || !tagDetails) {
    return null;
  }

  return (
    <div className="fixed bottom-0 inset-x-0 mx-auto max-w-5xl bg-white border-t border-orange-200 shadow-lg p-4 transition-all duration-300 ease-in-out rounded-t-lg">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-serif font-bold text-orange-900 text-lg">{tagDetails.tag_name}</h4>
        <button
          onClick={onClose}
          className="text-orange-500 hover:text-orange-700"
          aria-label="Close panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          {tagDetails.main_topics && tagDetails.main_topics.length > 0 && (
            <div className="mb-2">
              <span className="text-orange-700 font-medium">Categories: </span>
              {tagDetails.main_topics.map((topic, idx) => (
                <span key={idx} className="inline-block bg-orange-100 text-orange-800 text-sm px-2 py-0.5 rounded-full mr-1">
                  {topic}
                </span>
              ))}
            </div>
          )}

          {tagDetails.subject_info && tagDetails.subject_info.length > 0 && (
            <p className="text-orange-800 mb-2">
              <span className="font-medium">Subject: </span>
              {tagDetails.subject_info.join(' • ')}
            </p>
          )}

          <p className="text-sm text-orange-700">
            Appears {tagDetails.occurrences?.length || 0} times in this adhyaya
          </p>

          {/* Occurrences list */}
          {tagDetails.occurrences && tagDetails.occurrences.length > 1 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-orange-800 mb-1">Occurrences in this adhyaya:</p>
              <div className="max-h-28 overflow-y-auto bg-orange-50 rounded p-2">
                <ul className="space-y-1">
                  {tagDetails.occurrences.map((occurrence, idx) => (
                    <li key={idx}>
                      <button
                        className="text-left w-full text-sm hover:bg-orange-100 px-2 py-1 rounded text-orange-900"
                        onClick={() => onOccurrenceClick(occurrence)}
                      >
                        <span className="font-medium">#{idx + 1}</span>:
                        <span className="italic ml-1">
                          {occurrence.before_text.slice(-20)}
                          <span className="font-bold not-italic">
                            {occurrence.match_text.substring(0, 30)}
                            {occurrence.match_text.length > 30 ? '...' : ''}
                          </span>
                          {occurrence.after_text.slice(0, 20)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <button
            className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm whitespace-nowrap"
            onClick={() => navigate(`/search?q=${encodeURIComponent(tagDetails.tag_name)}`)}
          >
            Search All Occurrences
          </button>

          {/* Export option */}
          <button
            className="px-3 py-1 bg-orange-100 text-orange-800 rounded hover:bg-orange-200 text-sm whitespace-nowrap"
            onClick={() => {
              // Create a text version of the tag information
              const content = `
                Tag: ${tagDetails.tag_name}
                ${tagDetails.main_topics?.length ? 'Categories: ' + tagDetails.main_topics.join(', ') : ''}
                ${tagDetails.subject_info?.length ? 'Subject: ' + tagDetails.subject_info.join(' • ') : ''}
                Occurrences: ${tagDetails.occurrences?.length || 0}
              `.trim();

              // Create a blob and download link
              const blob = new Blob([content], { type: 'text/plain' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `tag-${tagDetails.tag_name.replace(/[^a-z0-9]/gi, '_')}.txt`;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }}
          >
            Export Tag Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagDetailsPanel;
