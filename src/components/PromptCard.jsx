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
  if (!prompt) return null;

  return (
    <div
      className={`absolute top-0 left-0 w-full h-full rounded-2xl p-12 text-center flex flex-col justify-center cursor-pointer transition-transform duration-300 ease-in-out bg-white`}
      style={{
        boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
        zIndex: 30,
        transform: isAnimating
          ? 'translateX(100%) rotate(10deg)'
          : 'translateX(0) rotate(0deg)',
      }}
      onClick={onClick}
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
        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
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

      {/* HIDE button in bottom left */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleHidden(prompt.text);
        }}
        className="absolute bottom-4 left-4 px-3 py-1 text-xs font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
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
        className="absolute bottom-4 right-4 px-3 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors"
        aria-label="Add prompt to list"
      >
        Add to list
      </button>

      {/* Card content */}
      <div className="flex items-center justify-center h-full">
        <p className="text-2xl leading-relaxed text-gray-800">{prompt.text}</p>
      </div>
    </div>
  );
});

PromptCard.displayName = 'PromptCard';

export default PromptCard;
