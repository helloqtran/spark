import React from 'react';
import { Heart, Info, ListPlus } from 'lucide-react';

/**
 * PromptCard Component
 * 
 * Displays a single prompt with interactive elements for favoriting,
 * and adding to lists. Used in the main card deck.
 */
const PromptCard = React.memo(({ 
  prompt, 
  isAnimating, 
  favorites, 
  onToggleFavorite, 
  onAddToList, 
  onClick 
}) => {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [touchStartX, setTouchStartX] = React.useState(null);
  const [touchStartY, setTouchStartY] = React.useState(null);
  
  // Consistent line spacing ratio for mobile and desktop
  const getTextSize = (text) => {
    const length = text.length;
    if (length <= 80) return 'text-3xl sm:text-4xl leading-snug sm:leading-snug';
    if (length <= 120) return 'text-2xl sm:text-3xl leading-snug sm:leading-snug';
    if (length <= 180) return 'text-xl sm:text-2xl leading-snug sm:leading-snug';
    if (length <= 250) return 'text-lg sm:text-xl leading-snug sm:leading-snug';
    if (length <= 400) return 'text-base sm:text-lg leading-snug sm:leading-snug';
    return 'text-sm sm:text-base leading-snug sm:leading-snug';
  };

  // Reset flip state when prompt changes
  React.useEffect(() => {
    setIsFlipped(false);
  }, [prompt.text]);

  const handleFlip = (e) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  // Touch gesture handling for swiping
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
  };

  const handleTouchMove = (e) => {
    // Prevent page scrolling when moving on card
    e.preventDefault();
    e.stopPropagation();
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX || !touchStartY) {
      setTouchStartX(null);
      setTouchStartY(null);
      return;
    }

    const touch = e.changedTouches[0];
    const touchEndX = touch.clientX;
    const touchEndY = touch.clientY;

    const distanceX = touchEndX - touchStartX;
    const distanceY = Math.abs(touchEndY - touchStartY);

    // If minimal movement - treat as tap, allow natural onClick to handle
    if (Math.abs(distanceX) <= 10 && distanceY <= 10) {
      setTouchStartX(null);
      setTouchStartY(null);
      return; // Let the onClick handler take care of it
    }

    // Check if it's a horizontal swipe (more horizontal than vertical movement)
    if (Math.abs(distanceX) > distanceY && Math.abs(distanceX) > 50) {
      // Swipe in either direction - trigger next prompt directly
      e.preventDefault();
      e.stopPropagation();
      onClick();
    }

    // Reset
    setTouchStartX(null);
    setTouchStartY(null);
  };


  if (!prompt) return null;

  return (
    <div
      className={`absolute top-0 left-0 w-full h-full cursor-pointer transition-transform duration-300 ease-in-out`}
      style={{
        zIndex: 30,
        transform: isAnimating
          ? 'translateX(100%) rotate(10deg)'
          : 'translateX(0) rotate(0deg)',
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Movement prompt: ${prompt.text}`}
      data-prompt-card={true}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Card container with flip animation */}
      <div 
        className="relative w-full h-full rounded-2xl transition-transform duration-600 ease-in-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
        }}
      >
        {/* Front side of card */}
        <div 
          className="absolute inset-0 w-full h-full rounded-2xl p-4 sm:p-12 text-center flex flex-col bg-white backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Icon buttons centered in bottom */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
            {/* Info icon */}
            <button
              onClick={handleFlip}
              onTouchStart={(e) => e.stopPropagation()}
              className="px-3 py-2 sm:px-4 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="View prompt details"
            >
              <Info size={20} className="text-gray-400 hover:text-blue-500" />
            </button>

            {/* Heart icon */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(prompt.text);
              }}
              onTouchStart={(e) => e.stopPropagation()}
              className="px-3 py-2 sm:px-4 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={favorites.has(prompt.text) ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart 
                size={20} 
                className={favorites.has(prompt.text) 
                  ? "fill-pink-500 text-pink-500" 
                  : "text-gray-400 hover:text-pink-500"
                } 
              />
            </button>


            {/* Add to list button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToList();
              }}
              onTouchStart={(e) => e.stopPropagation()}
              className="px-3 py-2 sm:px-4 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Add prompt to list"
            >
              <ListPlus size={20} className="text-gray-400 hover:text-blue-500" />
            </button>
          </div>

          {/* Card content - flexible layout that uses full available space */}
          <div className="absolute top-4 left-4 right-4 bottom-16 flex items-center justify-center px-4 sm:top-6 sm:left-6 sm:right-6 sm:bottom-20 sm:px-6">
            <p className={`${getTextSize(prompt.text)} text-gray-800 noto-serif-jp-normal text-center leading-relaxed`}>
              {prompt.text}
            </p>
          </div>
        </div>

        {/* Back side of card */}
        <div 
          className="absolute inset-0 w-full h-full rounded-2xl p-4 sm:p-12 text-center flex flex-col justify-center bg-gray-50 border-2 border-gray-200 cursor-pointer"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          onClick={handleFlip}
          role="button"
          tabIndex={0}
          aria-label="Back to prompt"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleFlip(e);
            }
          }}
        >
          {/* Back side content */}
          <div className="flex flex-col items-center justify-between h-full">
            {/* Main content area */}
            <div className="flex flex-col items-center justify-center flex-1 space-y-6">
              {/* Type section */}
              {prompt.type && (
                <div className="text-center">
                  <h3 className="text-sm sm:text-xs font-medium mb-2 text-gray-600">Type</h3>
                  <div className="inline-block px-4 py-2 rounded-full text-sm font-medium text-gray-800 bg-gray-200">
                    {prompt.type}
                  </div>
                </div>
              )}

              {/* Tags section */}
              {prompt.tags && prompt.tags.length > 0 && (
                <div className="text-center">
                  <h3 className="text-sm sm:text-xs font-medium mb-3 text-gray-600">Tags</h3>
                  <div className="flex flex-wrap justify-center gap-2 max-w-xs">
                    {prompt.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm font-medium text-gray-800 bg-gray-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Credit section */}
              {prompt.credit && (
                <div className="text-center">
                  {/* Separator line */}
                  <div className="w-16 h-px mx-auto mb-4 bg-gray-400"></div>
                  {prompt.creditUrl ? (
                    <a
                      href={prompt.creditUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {prompt.credit}
                    </a>
                  ) : (
                    <div className="text-sm text-gray-600">
                      {prompt.credit}
                    </div>
                  )}
                </div>
              )}

              {/* No metadata message */}
              {!prompt.type && (!prompt.tags || prompt.tags.length === 0) && !prompt.credit && (
                <div className="text-center">
                  <p className="text-gray-500 text-sm">No additional metadata available</p>
                </div>
              )}
            </div>

            {/* Tap to flip back hint - moved to bottom */}
            <div className="text-center pb-4">
              <p className="text-xs text-gray-400">Tap to return</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

PromptCard.displayName = 'PromptCard';

export default PromptCard;
