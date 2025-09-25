import React from 'react';
import { Heart } from 'lucide-react';

/**
 * PromptCard Component
 * 
 * Displays a single prompt with interactive elements for favoriting,
 * hiding, and adding to lists. Used in the main card deck.
 */
const PromptCard = React.memo(({ 
  prompt, 
  isAnimating, 
  favorites, 
  hiddenPrompts, 
  onToggleFavorite, 
  onToggleHidden, 
  onAddToList, 
  onClick 
}) => {
  const [touchStart, setTouchStart] = React.useState(null);
  const [touchEnd, setTouchEnd] = React.useState(null);

  // Dynamic text sizing based on text length
  const getTextSize = (text) => {
    const length = text.length;
    if (length <= 80) return 'text-3xl sm:text-4xl leading-responsive-3xl sm:leading-responsive-4xl';
    if (length <= 120) return 'text-2xl sm:text-3xl leading-responsive-xl sm:leading-responsive-2xl';
    if (length <= 180) return 'text-xl sm:text-2xl leading-responsive-lg sm:leading-responsive-xl';
    if (length <= 250) return 'text-lg sm:text-xl leading-responsive-base sm:leading-responsive-lg';
    return 'text-base sm:text-lg leading-responsive-sm sm:leading-responsive-base';
  };

  const minSwipeDistance = 30;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = (e) => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe || isRightSwipe) {
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }
    
    // Reset touch states
    setTouchStart(null);
    setTouchEnd(null);
  };

  if (!prompt) return null;

  return (
    <div
      className={`absolute top-0 left-0 w-full h-full rounded-2xl p-4 sm:p-12 text-center flex flex-col justify-center cursor-pointer transition-transform duration-300 ease-in-out bg-white`}
      style={{
        boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
        zIndex: 30,
        transform: isAnimating
          ? 'translateX(100%) rotate(10deg)'
          : 'translateX(0) rotate(0deg)',
      }}
      onClick={onClick}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      role="button"
      tabIndex={0}
      aria-label={`Movement prompt: ${prompt.text}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Heart icon in top right */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(prompt.text);
        }}
        onTouchStart={(e) => e.stopPropagation()}
        className="absolute top-3 right-3 sm:top-4 sm:right-4 p-3 hover:bg-gray-100 rounded-full transition-colors"
        aria-label={favorites.has(prompt.text) ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart 
          size={24} 
          className={favorites.has(prompt.text) 
            ? "fill-pink-500 text-pink-500" 
            : "text-gray-400 hover:text-pink-500"
          } 
        />
      </button>

      {/* HIDE button in bottom left */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleHidden(prompt.text);
        }}
        onTouchStart={(e) => e.stopPropagation()}
        className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 px-3 py-2 sm:px-4 text-sm font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        aria-label={hiddenPrompts.has(prompt.text) ? 'Show prompt' : 'Hide prompt'}
      >
        {hiddenPrompts.has(prompt.text) ? "SHOW" : "HIDE"}
      </button>

      {/* Add to list button in bottom right */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddToList();
        }}
        onTouchStart={(e) => e.stopPropagation()}
        className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 px-3 py-2 sm:px-4 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
        aria-label="Add prompt to list"
      >
        Add to list
      </button>

      {/* Card content */}
      <div className="flex items-center justify-center h-full">
        <p className={`${getTextSize(prompt.text)} text-gray-800 px-2 noto-serif-jp-normal`}>{prompt.text}</p>
      </div>
    </div>
  );
});

PromptCard.displayName = 'PromptCard';

export default PromptCard;
