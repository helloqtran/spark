import React, { useState, useEffect, useCallback } from 'react';

/**
 * usePromptNavigation Hook
 * 
 * Manages prompt navigation state and logic.
 * Extracted from MainPromptsPage to improve maintainability.
 */
export const usePromptNavigation = (availablePrompts) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPromptText, setCurrentPromptText] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [cardsViewed, setCardsViewed] = useState(0);

  // Memoized current prompt - try to find the stored prompt text first
  const currentPrompt = React.useMemo(() => {
    if (availablePrompts.length === 0) return null;
    
    // If we have a stored prompt text, try to find it in the current filtered list
    if (currentPromptText) {
      const foundPrompt = availablePrompts.find(p => p.text === currentPromptText);
      if (foundPrompt) {
        return foundPrompt;
      }
    }
    
    // Fallback to index-based selection
    return availablePrompts[currentIndex] || availablePrompts[0];
  }, [availablePrompts, currentIndex, currentPromptText]);

  // Update current prompt text when it changes
  useEffect(() => {
    if (currentPrompt) {
      setCurrentPromptText(currentPrompt.text);
    }
  }, [currentPrompt]);

  // Update current prompt when available prompts change
  useEffect(() => {
    if (availablePrompts.length > 0) {
      // Reset completion state when available prompts change
      setIsComplete(false);
      setCardsViewed(0);
      // Only reset index if current index is out of bounds
      if (currentIndex >= availablePrompts.length) {
        setCurrentIndex(0);
      }
    } else {
      // If no prompts available, reset to 0
      setCurrentIndex(0);
      setIsComplete(false);
      setCardsViewed(0);
    }
  }, [availablePrompts.length, currentIndex]);

  // Initialize view count on first navigation load
  useEffect(() => {
    if (availablePrompts.length > 0 && cardsViewed === 0) {
      setCardsViewed(1); // The first card is being viewed
    }
  }, [availablePrompts.length, cardsViewed]);

  // Check for completion
  useEffect(() => {
    if (cardsViewed >= availablePrompts.length && availablePrompts.length > 0) {
      setIsComplete(true);
    }
  }, [cardsViewed, availablePrompts.length]);

  // Reset function that shuffles the deck  
  const resetDeck = useCallback(() => {
    setIsComplete(false);
    setCardsViewed(1); // Start with viewing the first card
    // Start at a random position in the deck
    const randomIndex = Math.floor(Math.random() * availablePrompts.length);
    setCurrentIndex(randomIndex);
    setCurrentPromptText(availablePrompts[randomIndex]?.text || null);
  }, [availablePrompts]);

  // Memoized callback functions to prevent unnecessary re-renders
  const getNewPrompt = useCallback(() => {
    if (availablePrompts.length === 0 || isComplete) return;
    setIsAnimating(true);
    setTimeout(() => {
      const nextIndex = (currentIndex + 1) % availablePrompts.length;
      setCurrentIndex(nextIndex);
      setCurrentPromptText(availablePrompts[nextIndex]?.text || '');
      setCardsViewed(prev => prev + 1);
      setIsAnimating(false);
    }, 150);
  }, [availablePrompts.length, currentIndex, isComplete]);

  return {
    isAnimating,
    currentIndex,
    currentPrompt,
    currentPromptText,
    getNewPrompt,
    setCurrentPromptText,
    isComplete,
    resetDeck
  };
};
