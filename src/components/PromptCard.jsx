import React from 'react';
import { Heart, Info, EyeOff, ListPlus } from 'lucide-react';

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
  const [isFlipped, setIsFlipped] = React.useState(false);

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

  // Reset flip state when prompt changes
  React.useEffect(() => {
    setIsFlipped(false);
  }, [prompt.text]);

  const handleFlip = (e) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

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
      className={`absolute top-0 left-0 w-full h-full cursor-pointer transition-transform duration-300 ease-in-out`}
      style={{
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
          className="absolute inset-0 w-full h-full rounded-2xl p-4 sm:p-12 text-center flex flex-col justify-center bg-white backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Icon buttons centered in bottom */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 sm:bottom-12 flex gap-2">
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

            {/* Hide button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleHidden(prompt.text);
              }}
              onTouchStart={(e) => e.stopPropagation()}
              className="px-3 py-2 sm:px-4 hover:bg-gray-100 rounded-full transition-colors"
              aria-label={hiddenPrompts.has(prompt.text) ? 'Show prompt' : 'Hide prompt'}
            >
              <EyeOff 
                size={20} 
                className={hiddenPrompts.has(prompt.text) ? "text-red-400" : "text-gray-400 hover:text-gray-600"} 
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

          {/* Card content */}
          <div className="flex items-center justify-center h-full pb-8">
            <p className={`${getTextSize(prompt.text)} text-gray-800 px-6 noto-serif-jp-normal`}>{prompt.text}</p>
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
