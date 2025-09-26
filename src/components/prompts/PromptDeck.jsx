import React from 'react';
import { SearchX, RotateCcw, CheckCircle } from 'lucide-react';
import PromptCard from '../PromptCard';
import BackgroundCard from '../BackgroundCard';

/**
 * PromptDeck Component
 * 
 * Handles the display of the card deck with background cards and the main prompt card.
 * Extracted from MainPromptsPage to improve maintainability.
 */
const PromptDeck = React.memo(({ 
  availablePrompts, 
  currentIndex, 
  currentPrompt, 
  isAnimating, 
  onNextPrompt,
  onToggleFavorite,
  onAddToList,
  favorites,
  isComplete,
  onResetDeck
}) => {
  if (availablePrompts.length === 0) {
    return (
      <div className="text-center p-8">
        <SearchX size={64} className="mx-auto mb-4" style={{ color: '#D8A159' }} />
        <h3 className="text-xl font-semibold text-white mb-2">No cards match your current filters {':('}</h3>
        <p className="text-gray-300 mb-6">
          Have an idea for one that does? <a href="https://www.instagram.com/sparkcards.dance" target="_blank" rel="noopener noreferrer" className="underline transition-colors font-medium" style={{ color: '#D8A159' }}>DM me on Instagram!</a>
        </p>
      </div>
    );
  }

  // Show completion message when all cards have been seen
  if (isComplete) {
    return (
      <div className="relative w-[85%] sm:w-[500px] h-full">
        {/* Empty background cards maintaining identical layer structure to normal deck*/}
        <div style={{position: 'absolute', width: '100%', height: '100%', top: 0, left: 0}}></div>
        <div style={{position: 'absolute', width: '100%', height: '100%', top: 0, left: 0}}></div>
        
        {/* Completion overlay - simplified for layout consistency*/}
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-center p-8" style={{zIndex: 30}}>
          <CheckCircle size={64} className="mx-auto mb-4" style={{ color: '#D8A159' }} />
          <h3 className="text-xl font-semibold text-white mb-2">That's all the cards!</h3>
          <button
            onClick={onResetDeck}
            className="px-6 py-3 text-base font-medium rounded-lg text-black transition-colors mx-auto block"
            style={{ backgroundColor: '#D8A159' }}
          >
            <div className="flex items-center justify-center gap-2">
              <RotateCcw size={20} />
              Shuffle Again
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-[85%] sm:w-[500px] h-full"
    >
      {/* Background cards */}
      {[1, 2].map((offsetIndex) => {
        const cardIndex = (currentIndex + offsetIndex) % availablePrompts.length;
        const prompt = availablePrompts[cardIndex];
        
        // Only render if we have a valid prompt
        if (!prompt) return null;
        
        return (
          <BackgroundCard
            key={`bg-${offsetIndex}-${cardIndex}`}
            prompt={prompt}
            offsetIndex={offsetIndex}
            isAnimating={isAnimating}
            cardIndex={cardIndex}
          />
        );
      })}

      {/* Front card */}
      {currentPrompt && (
        <PromptCard
          prompt={currentPrompt}
          isAnimating={isAnimating}
          favorites={favorites}
          onToggleFavorite={onToggleFavorite}
          onAddToList={onAddToList}
          onClick={onNextPrompt}
        />
      )}
    </div>
  );
});

PromptDeck.displayName = 'PromptDeck';

export default PromptDeck;
