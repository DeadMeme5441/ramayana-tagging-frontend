import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SargaHeader from './AdhyayaHeader';
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
  
  // Listen for scroll to occurrence events - depends on activeTag to force re-binding
  useEffect(() => {
    const handleScrollToOccurrence = (event) => {
      if (event.detail && event.detail.occurrence) {
        // Use a longer delay to ensure rendering is complete
        setTimeout(() => {
          scrollToTagOccurrence(event.detail.occurrence);
        }, 500);
      }
    };
    
    const handleScrollToFirstHighlight = () => {
      // This simply scrolls to the first highlighted element with a longer delay
      setTimeout(() => {
        scrollToFirstHighlightedElement();
      }, 500);
    };
    
    window.addEventListener('scrollToOccurrence', handleScrollToOccurrence);
    window.addEventListener('scrollToFirstHighlight', handleScrollToFirstHighlight);
    
    // Important: This will force scroll to first highlight whenever activeTag changes
    if (activeTag) {
      // Use a longer delay to make sure the DOM is fully rendered
      setTimeout(() => {
        scrollToFirstHighlightedElement();
      }, 500);
    }
    
    return () => {
      window.removeEventListener('scrollToOccurrence', handleScrollToOccurrence);
      window.removeEventListener('scrollToFirstHighlight', handleScrollToFirstHighlight);
    };
  }, [activeTag, adhyayaContent]); // Added dependencies to force effect to run when tag or content changes
  
  // Helper function to scroll to the first highlighted element
  const scrollToFirstHighlightedElement = () => {
    if (!contentRef.current) return;
    
    // Get the scrollable container
    const scrollContainer = contentRef.current.closest('.overflow-y-auto');
    if (!scrollContainer) return;

    // Find the first highlighted element
    const highlightedElements = contentRef.current.querySelectorAll('.bg-amber-200');
    
    if (highlightedElements.length > 0) {
      // Take the first highlighted element
      const targetElement = highlightedElements[0];
      
      // Add a temporary visible indicator to help user see where we've scrolled to
      const tempIndicator = document.createElement('div');
      tempIndicator.className = 'bg-orange-300 absolute -ml-4 w-2 h-full animate-pulse';
      tempIndicator.style.position = 'absolute';
      tempIndicator.style.left = '0';
      tempIndicator.style.height = targetElement.offsetHeight + 'px';
      
      // Insert the indicator
      targetElement.parentNode.insertBefore(tempIndicator, targetElement);
      targetElement.style.position = 'relative';
      
      // Get element position
      const containerRect = scrollContainer.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();
      
      // Calculate scroll position to put the element near the top with padding
      const scrollTop = targetRect.top - containerRect.top - 120 + scrollContainer.scrollTop;
      
      // Scroll to it
      scrollContainer.scrollTo({
        top: Math.max(0, scrollTop), // Ensure we don't try to scroll to negative positions
        behavior: 'smooth'
      });
      
      // Remove the indicator after a delay
      setTimeout(() => {
        tempIndicator.remove();
      }, 3000);
    }
  };

  // Function to navigate to previous or next sarga
  const navigateToSarga = (target) => {
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
    if (!contentRef.current || !occurrence) return;
    
    // Get the scrollable container
    const scrollContainer = contentRef.current.closest('.overflow-y-auto');
    if (!scrollContainer) return;

    // Find all highlighted elements
    const highlightedElements = contentRef.current.querySelectorAll('.bg-amber-200');
    
    // If we have occurrence index, use that to find the specific occurrence
    if (occurrence.index !== undefined && highlightedElements.length > occurrence.index) {
      const targetElement = highlightedElements[occurrence.index];
      
      // Add a temporary visible indicator
      const tempIndicator = document.createElement('div');
      tempIndicator.className = 'bg-orange-400 absolute -ml-4 w-2 h-full animate-pulse';
      tempIndicator.style.position = 'absolute';
      tempIndicator.style.left = '0';
      tempIndicator.style.height = targetElement.offsetHeight + 'px';
      
      // Insert the indicator
      targetElement.parentNode.insertBefore(tempIndicator, targetElement);
      targetElement.style.position = 'relative';
      
      // Get element position for scrolling
      const containerRect = scrollContainer.getBoundingClientRect();
      const targetRect = targetElement.getBoundingClientRect();
      
      // Calculate scroll position to put the element near the top with padding
      const scrollTop = targetRect.top - containerRect.top - 120 + scrollContainer.scrollTop;
      
      // Scroll to it
      scrollContainer.scrollTo({
        top: Math.max(0, scrollTop),
        behavior: 'smooth'
      });
      
      // Remove the indicator after a delay
      setTimeout(() => {
        tempIndicator.remove();
      }, 3000);
    } else {
      // Fallback to first occurrence if no specific index
      scrollToFirstHighlightedElement();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Sarga Header - fixed at the top */}
      <div className="p-6 pb-2 bg-amber-50 flex-shrink-0">
        <SargaHeader
          adhyayaContent={adhyayaContent}
          khandaId={khandaId}
          adhyayaId={adhyayaId}
          activeTag={activeTag}
          onClearActiveTag={() => {
            onTagDetailsPanelClose();
          }}
          onNavigate={navigateToSarga}
        />
      </div>

      {/* Scrollable content area */}
      <div className="flex-grow overflow-y-auto px-6 pb-6">
        {/* Sarga Content with highlighted tags */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <SanskritTextRenderer
            key={`text-${activeTag || 'no-tag'}`} /* Add key to force re-rendering when tag changes */
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
    </div>
  );
};

export default MainContent;
