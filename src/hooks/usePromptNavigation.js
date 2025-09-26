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
  const [unseenPrompts, setUnseenPrompts] = useState([]);

  // Memoized current prompt - get from unseen prompts deck
  const currentPrompt = React.useMemo(() => {
    if (unseenPrompts.length === 0) return null;
    
    if (currentPromptText) {
      const foundPrompt = unseenPrompts.find(p => p.text === currentPromptText);
      if (foundPrompt) {
        return foundPrompt;
      }
    }
    
    return unseenPrompts[currentIndex] || unseenPrompts[0];
  }, [unseenPrompts, currentIndex, currentPromptText]);

  // Update current prompt text when it changes
  useEffect(() => {
    if (currentPrompt) {
      setCurrentPromptText(currentPrompt.text);
    }
  }, [currentPrompt]);

  // Initialize unseen prompts when available prompts change
  useEffect(() => {
    if (availablePrompts.length > 0) {
      // Shuffle the available prompts for a truly random deck
      const shuffled = [...availablePrompts].sort(() => Math.random() - 0.5);
      setUnseenPrompts(shuffled);
      setCurrentIndex(0);
      setIsComplete(false);
      setCardsViewed(0);
    } else {
      setUnseenPrompts([]);
      setCurrentIndex(0);
      setIsComplete(false);
      setCardsViewed(0);
    }
  }, [availablePrompts.length]);

  // Initialize view count on first navigation load
  useEffect(() => {
    if (availablePrompts.length > 0 && cardsViewed === 0) {
      setCardsViewed(1); // The first card is being viewed
    }
  }, [availablePrompts.length, cardsViewed]);

  // Check for completion
  useEffect(() => {
    if (cardsViewed >= unseenPrompts.length && unseenPrompts.length > 0) {
      setIsComplete(true);
    }
  }, [cardsViewed, unseenPrompts.length]);

  // Reset function that shuffles the deck  
  const resetDeck = useCallback(() => {
    if (availablePrompts.length > 0) {
      const shuffled = [...availablePrompts].sort(() => Math.random() - 0.5);
      setUnseenPrompts(shuffled);
      setCurrentIndex(0);
      setIsComplete(false);
      setCardsViewed(1); // Start with viewing the first card
      setCurrentPromptText(shuffled[0]?.text || null);
    }
  }, [availablePrompts]);

  // Memoized callback functions to prevent unnecessary re-renders
  const getNewPrompt = useCallback(() => {
    if (unseenPrompts.length === 0 || isComplete) return;
    setIsAnimating(true);
    setTimeout(() => {
      // Stop if we've viewed all cards
      if (currentIndex + 1 >= unseenPrompts.length) {
        setIsComplete(true);
        setIsAnimating(false);
        return;
      }
      
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentPromptText(unseenPrompts[nextIndex]?.text || '');
      setCardsViewed(prev => prev + 1);
      setIsAnimating(false);
    }, 150);
  }, [unseenPrompts.length, currentIndex, isComplete]);

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
