import React from 'react';
import { SearchX } from 'lucide-react';
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
  favorites
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

  return (
    <div 
      className="relative w-[85%] sm:w-[500px]" 
      style={{ 
        height: 'min(calc(60vh - 120px), 450px)',
        minHeight: '300px'
      }}
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
