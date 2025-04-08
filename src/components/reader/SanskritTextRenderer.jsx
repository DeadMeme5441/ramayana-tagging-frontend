import React from 'react';

/**
 * A specialized component for rendering Sanskrit text with tag highlighting
 *
 * @param {Object} props
 * @param {string} props.content - The text content to render
 * @param {string|null} props.activeTag - The currently active tag (or null if none)
 * @param {Object} props.structuredTags - Tag information from the backend
 * @param {Object} props.contentRef - React ref to attach to the content container
 */
const SanskritTextRenderer = ({ content, activeTag, structuredTags, contentRef }) => {
  // If no content, show placeholder
  if (!content) {
    return <p className="text-gray-500 italic">No content available</p>;
  }

  // If no active tag, render plain text with paragraph breaks
  if (!activeTag) {
    return (
      <div ref={contentRef} className="text-lg leading-relaxed font-serif">
        {content.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className="mb-4">{paragraph}</p>
        ))}
      </div>
    );
  }

  // If we have an active tag but no structured tag data, still render plain text
  if (!structuredTags || !structuredTags.position_map) {
    return (
      <div ref={contentRef} className="text-lg leading-relaxed font-serif">
        {content.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className="mb-4">{paragraph}</p>
        ))}
      </div>
    );
  }

  // Find all positions for the active tag
  const highlightPositions = Object.values(structuredTags.position_map)
    .filter(pos => pos.tag_name === activeTag)
    .sort((a, b) => a.start - b.start);

  // If no positions found for this tag, render plain text
  if (highlightPositions.length === 0) {
    return (
      <div ref={contentRef} className="text-lg leading-relaxed font-serif">
        {content.split('\n\n').map((paragraph, idx) => (
          <p key={idx} className="mb-4">{paragraph}</p>
        ))}
      </div>
    );
  }

  // Create text segments with highlighting
  const segments = [];
  let lastEnd = 0;

  highlightPositions.forEach((pos, index) => {
    // Add text before this highlight
    if (pos.start > lastEnd) {
      segments.push({
        text: content.substring(lastEnd, pos.start),
        isHighlighted: false,
        key: `before-${index}`
      });
    }

    // Add highlighted text
    segments.push({
      text: content.substring(pos.start, pos.end),
      isHighlighted: true,
      key: `highlight-${index}`
    });

    lastEnd = pos.end;
  });

  // Add remaining text after last highlight
  if (lastEnd < content.length) {
    segments.push({
      text: content.substring(lastEnd),
      isHighlighted: false,
      key: 'after-last'
    });
  }

  // Render segments with paragraph breaks
  const paragraphs = [];
  let currentParagraphSegments = [];
  let paragraphIdx = 0;

  // Process each segment
  segments.forEach(segment => {
    // Split segment text by paragraph breaks
    const paragraphParts = segment.text.split('\n\n');

    // Add first part to current paragraph
    currentParagraphSegments.push({
      ...segment,
      text: paragraphParts[0],
      key: `${segment.key}-p0`
    });

    // Process any additional paragraph breaks
    if (paragraphParts.length > 1) {
      // Add the current paragraph to paragraphs array
      paragraphs.push(
        <p key={`p-${paragraphIdx++}`} className="mb-4">
          {currentParagraphSegments.map(part =>
            part.isHighlighted ?
              <span key={part.key} className="bg-amber-200 rounded px-0.5">{part.text}</span> :
              <span key={part.key}>{part.text}</span>
          )}
        </p>
      );

      // Reset current paragraph
      currentParagraphSegments = [];

      // Add middle paragraphs directly
      for (let i = 1; i < paragraphParts.length - 1; i++) {
        paragraphs.push(
          <p key={`p-${paragraphIdx++}`} className="mb-4">
            {segment.isHighlighted ?
              <span className="bg-amber-200 rounded px-0.5">{paragraphParts[i]}</span> :
              paragraphParts[i]
            }
          </p>
        );
      }

      // Start a new paragraph with the last part
      if (paragraphParts.length > 1) {
        currentParagraphSegments.push({
          ...segment,
          text: paragraphParts[paragraphParts.length - 1],
          key: `${segment.key}-plast`
        });
      }
    }
  });

  // Add the final paragraph if not empty
  if (currentParagraphSegments.length > 0) {
    paragraphs.push(
      <p key={`p-${paragraphIdx}`} className="mb-4">
        {currentParagraphSegments.map(part =>
          part.isHighlighted ?
            <span key={part.key} className="bg-amber-200 rounded px-0.5">{part.text}</span> :
            <span key={part.key}>{part.text}
          </span>
        )}
      </p>
    );
  }

  return <div ref={contentRef} className="text-lg leading-relaxed font-serif">{paragraphs}</div>;
};

export default SanskritTextRenderer;
