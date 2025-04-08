import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AdhyayaHeader from './AdhyayaHeader';
import SanskritTextRenderer from './SanskritTextRenderer';
import TagDetailsPanel from './TagDetailsPanel';

const MainContent = ({
  adhyayaContent,
  activeTag,
  tagDetails,
  tagDetailsPanelOpen,
  onTagDetailsPanelClose,
  khandaId,
  adhyayaId,
  navigationSidebarOpen,
  toggleNavigationSidebar
}) => {
  const navigate = useNavigate();
  const contentRef = useRef(null);

  // Function to navigate to previous or next adhyaya
  const navigateToAdhyaya = (target) => {
    if (!adhyayaContent || !adhyayaContent.navigation) return;

    const { previous, next } = adhyayaContent.navigation;

    if (target === 'previous' && previous) {
      navigate(`/read/${previous.khanda_id}/${previous.adhyaya_id}`);
    } else if (target === 'next' && next) {
      navigate(`/read/${next.khanda_id}/${next.adhyaya_id}`);
    }
  };

  // Helper function to scroll to a specific occurrence
  const scrollToTagOccurrence = (occurrence) => {
    if (!contentRef.current || !occurrence || !occurrence.position) return;

    // Find all text nodes in the content
    const textNodes = [];
    const findTextNodes = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        textNodes.push(node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        Array.from(node.childNodes).forEach(findTextNodes);
      }
    };

    findTextNodes(contentRef.current);

    // Calculate the cumulative length to find the node containing our position
    let cumulativeLength = 0;
    for (const textNode of textNodes) {
      cumulativeLength += textNode.textContent.length;
      if (cumulativeLength >= occurrence.position.start) {
        // We found the node containing our position
        textNode.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        break;
      }
    }
  };

  return (
    <div className="flex-grow overflow-y-auto p-6">
      {/* Adhyaya Header */}
      <AdhyayaHeader
        adhyayaContent={adhyayaContent}
        khandaId={khandaId}
        adhyayaId={adhyayaId}
        activeTag={activeTag}
        onClearActiveTag={() => {
          onTagDetailsPanelClose();
        }}
        onNavigate={navigateToAdhyaya}
      />

      {/* Adhyaya Content with highlighted tags */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <SanskritTextRenderer
          content={adhyayaContent.content}
          activeTag={activeTag}
          structuredTags={adhyayaContent.structured_tags}
          contentRef={contentRef}
        />
      </div>

      {/* Tag details panel */}
      <TagDetailsPanel
        isOpen={tagDetailsPanelOpen}
        tagDetails={tagDetails}
        onClose={onTagDetailsPanelClose}
        onOccurrenceClick={scrollToTagOccurrence}
      />
    </div>
  );
};

export default MainContent;
