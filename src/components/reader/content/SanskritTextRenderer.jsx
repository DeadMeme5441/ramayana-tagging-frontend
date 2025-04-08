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
  // Helper function to clean text
  const cleanText = (text) => {
    if (!text) return '';
    
    // Remove HTML tags
    let cleaned = text.replace(/<[^>]+>/g, '');
    
    // Replace consecutive newlines with a single newline
    cleaned = cleaned.replace(/\n\s*\n/g, '\n');
    
    // Add tab space after colons (but not after URLs or time notation)
    cleaned = cleaned.replace(/([^\d:\/])(: )(?!\/)/g, '$1:\u00A0\u00A0\u00A0'); // Using non-breaking spaces
    cleaned = cleaned.replace(/([^\d:\/])(:)(?=[^\s\/])/g, '$1:\u00A0\u00A0\u00A0'); // Add spaces when no space after colon
    
    // Return without trimming to preserve leading/trailing newlines
    return cleaned;
  };

  // Clean the content text
  const cleanedContent = cleanText(content);
  
  // If no content, show placeholder
  if (!cleanedContent.trim()) {
    return <p className="text-gray-500 italic">No content available</p>;
  }

  // Function to render plain text with preserved paragraph breaks and proper formatting
  const renderPlainText = (content) => (
    <div ref={contentRef} className="text-lg leading-relaxed font-serif">
      {content.split('\n').map((paragraph, idx) => (
        <p key={idx} className="mb-4">{paragraph}</p>
      ))}
    </div>
  );

  // If no active tag, render plain text with paragraph breaks
  if (!activeTag) {
    return renderPlainText(cleanedContent);
  }

  // If we have an active tag but no structured tag data, still render plain text
  if (!structuredTags || !structuredTags.position_map) {
    return renderPlainText(cleanedContent);
  }

  // Find all positions for the active tag
  const highlightPositions = Object.values(structuredTags.position_map)
    .filter(pos => pos.tag_name === activeTag)
    .sort((a, b) => a.start - b.start);

  // If no positions found for this tag, render plain text
  if (highlightPositions.length === 0) {
    return renderPlainText(cleanedContent);
  }

  // To preserve the exact formatting, we'll work with the original content
  // with only HTML tags removed, but keep all newlines intact
  
  // For processing, we need to handle the entire content as a unit instead of segments
  // Create text segments with highlighting
  const segments = [];
  let lastEnd = 0;

  // First segment - if content starts with newlines, we need to preserve them
  if (highlightPositions[0].start > 0) {
    const startSegment = cleanText(content.substring(0, highlightPositions[0].start));
    segments.push({
      text: startSegment,
      isHighlighted: false,
      key: 'before-first'
    });
  }

  // Process all highlight positions
  highlightPositions.forEach((pos, index) => {
    // Add text between last highlight and this one
    if (index > 0 && pos.start > lastEnd) {
      segments.push({
        text: cleanText(content.substring(lastEnd, pos.start)),
        isHighlighted: false,
        key: `between-${index}`
      });
    } else if (index === 0 && pos.start > 0 && lastEnd === 0) {
      // This case is already handled in the first segment
      lastEnd = 0;
    }

    // Add highlighted text - remove leading and trailing newlines from the highlighted segment
    const highlightedText = cleanText(content.substring(pos.start, pos.end));
    
    // Handle leading newlines
    const leadingNewlineMatch = highlightedText.match(/^(\n+)/);
    const leadingNewlines = leadingNewlineMatch ? leadingNewlineMatch[1] : '';
    
    // Handle trailing newlines
    const trailingNewlineMatch = highlightedText.match(/(\n+)$/);
    const trailingNewlines = trailingNewlineMatch ? trailingNewlineMatch[1] : '';
    
    // Clean the highlighted text by removing leading and trailing newlines
    const trimmedHighlight = highlightedText
      .replace(/^\n+/, '')  // Remove leading newlines
      .replace(/\n+$/, ''); // Remove trailing newlines
    
    // Add leading newlines as a separate non-highlighted segment if present
    if (leadingNewlines.length > 0) {
      segments.push({
        text: leadingNewlines,
        isHighlighted: false,
        key: `highlight-${index}-leading-newlines`
      });
    }
    
    // Add the actual highlighted text
    if (trimmedHighlight.length > 0) {
      segments.push({
        text: trimmedHighlight, 
        isHighlighted: true,
        key: `highlight-${index}`,
        position: { start: pos.start, end: pos.end }
      });
    }
    
    // Add trailing newlines as a separate non-highlighted segment if present
    if (trailingNewlines.length > 0) {
      segments.push({
        text: trailingNewlines,
        isHighlighted: false,
        key: `highlight-${index}-trailing-newlines`
      });
    }

    lastEnd = pos.end;
  });

  // Add remaining text after last highlight
  if (lastEnd < content.length) {
    const endSegment = cleanText(content.substring(lastEnd));
    segments.push({
      text: endSegment,
      isHighlighted: false,
      key: 'after-last'
    });
  }

  // Instead of segmenting by paragraphs, let's rebuild the complete content
  // with highlight markers, then split into paragraphs once
  
  // First, combine all segments in order
  let combinedContent = '';
  const highlightRanges = [];
  let currentPosition = 0;
  
  segments.forEach(segment => {
    if (segment.isHighlighted) {
      highlightRanges.push({
        start: currentPosition,
        end: currentPosition + segment.text.length
      });
    }
    combinedContent += segment.text;
    currentPosition += segment.text.length;
  });
  
  // Now split the combined content into paragraphs
  const paragraphs = [];
  const contentParagraphs = combinedContent.split('\n');
  
  // Process each paragraph
  contentParagraphs.forEach((paragraph, paragraphIdx) => {
    // For each paragraph, create spans based on highlight ranges
    const spans = [];
    let lastEnd = 0;
    const paragraphStart = combinedContent.indexOf(paragraph, lastEnd);
    const paragraphEnd = paragraphStart + paragraph.length;
    
    // Find highlights that overlap with this paragraph
    highlightRanges.forEach((range, rangeIdx) => {
      // If highlight is within this paragraph
      if (range.start < paragraphEnd && range.end > paragraphStart) {
        // Text before highlight in this paragraph
        const highlightStartInParagraph = Math.max(range.start, paragraphStart);
        if (highlightStartInParagraph > lastEnd) {
          spans.push(
            <span key={`para-${paragraphIdx}-normal-${rangeIdx}`}>
              {paragraph.substring(lastEnd - paragraphStart, highlightStartInParagraph - paragraphStart)}
            </span>
          );
        }
        
        // Highlighted text in this paragraph
        const highlightEndInParagraph = Math.min(range.end, paragraphEnd);
        spans.push(
          <span key={`para-${paragraphIdx}-highlight-${rangeIdx}`} className="bg-amber-200 rounded px-0.5">
            {paragraph.substring(highlightStartInParagraph - paragraphStart, highlightEndInParagraph - paragraphStart)}
          </span>
        );
        
        lastEnd = highlightEndInParagraph;
      }
    });
    
    // Add any remaining text after the last highlight
    if (lastEnd < paragraphEnd) {
      spans.push(
        <span key={`para-${paragraphIdx}-normal-last`}>
          {paragraph.substring(lastEnd - paragraphStart)}
        </span>
      );
    }
    
    // Empty paragraphs should remain as is to preserve newlines
    if (spans.length === 0) {
      spans.push(<span key={`para-${paragraphIdx}-empty`}></span>);
    }
    
    // Add this paragraph to the output with whitespace preserved
    paragraphs.push(
      <p key={`p-${paragraphIdx}`} className="mb-4">{spans}</p>
    );
  });

  return <div ref={contentRef} className="text-lg leading-relaxed font-serif">{paragraphs}</div>;
};

export default SanskritTextRenderer;
