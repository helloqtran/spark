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
      // Only reset index if current index is out of bounds
      if (currentIndex >= availablePrompts.length) {
        setCurrentIndex(0);
      }
    } else {
      // If no prompts available, reset to 0
      setCurrentIndex(0);
    }
  }, [availablePrompts.length, currentIndex]);

  // Memoized callback functions to prevent unnecessary re-renders
  const getNewPrompt = useCallback(() => {
    if (availablePrompts.length === 0) return;
    setIsAnimating(true);
    setTimeout(() => {
      const nextIndex = (currentIndex + 1) % availablePrompts.length;
      setCurrentIndex(nextIndex);
      // Update the current prompt text to match the new index
      setCurrentPromptText(availablePrompts[nextIndex]?.text || '');
      setIsAnimating(false);
    }, 150);
  }, [availablePrompts.length, currentIndex]);

  return {
    isAnimating,
    currentIndex,
    currentPrompt,
    currentPromptText,
    getNewPrompt,
    setCurrentPromptText
  };
};
