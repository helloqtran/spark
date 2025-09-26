import React from 'react';

/**
 * BackgroundCard Component
 * 
 * Displays background cards in the deck to create depth and visual hierarchy.
 * These cards appear behind the main prompt card.
 */
const BackgroundCard = React.memo(({ 
  prompt, 
  offsetIndex, 
  isAnimating, 
  cardIndex 
}) => {
  const offset = offsetIndex * 8; // px offset to right/down
  const bgColor = offsetIndex === 1 ? '#f3f4f6' : '#e5e7eb'; // gray-100 and gray-200 (lighter)
  const shadowIntensity = offsetIndex === 1 
    ? '0 8px 25px rgba(0,0,0,0.15)' 
    : '0 4px 15px rgba(0,0,0,0.1)';
  
  // Make background cards more subtle during animation to reduce text visibility
  const isAnimatingSubtle = isAnimating;

  // Dynamic text sizing based on text length (same as PromptCard)
  const getTextSize = (text) => {
    const length = text.length;
    if (length <= 80) return 'text-2xl sm:text-3xl';
    if (length <= 120) return 'text-xl sm:text-2xl';
    if (length <= 180) return 'text-lg sm:text-xl';
    if (length <= 250) return 'text-base sm:text-lg';
    return 'text-sm sm:text-base';
  };
  
  return (
    <div
      className="absolute top-0 left-0 w-full h-full rounded-2xl p-4 sm:p-12 text-center flex flex-col justify-center transition-opacity duration-150 isolate"
      style={{
        transform: `translate(${offset}px, ${offset}px)`,
        backgroundColor: bgColor,
        zIndex: 20 - offsetIndex,
        boxShadow: shadowIntensity,
        opacity: isAnimatingSubtle ? 0.1 : 0.3,
      }}
    >
      <p className={`${getTextSize(prompt.text)} leading-snug text-gray-700 mb-2 px-2 noto-serif-jp-normal`}>{prompt.text}</p>
    </div>
  );
});

BackgroundCard.displayName = 'BackgroundCard';

export default BackgroundCard;
