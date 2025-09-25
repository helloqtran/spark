import { useState, useEffect } from 'react';
import DataService from '../services/DataService';

/**
 * User Data Management Hook - prepares for future authentication
 * 
 * This hook manages all user-specific data including favorites, hidden prompts,
 * custom lists, and selected categories. It provides a clean interface for
 * data manipulation and automatically persists changes to localStorage.
 */
export const useUserData = () => {
  const [favorites, setFavorites] = useState(new Set());
  const [hiddenPrompts, setHiddenPrompts] = useState(new Set());
  const [lists, setLists] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Load user data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setError(null);
        setFavorites(DataService.loadFavorites());
        setHiddenPrompts(DataService.loadHidden());
        setLists(DataService.loadLists());
        setSelectedCategories(DataService.loadSelectedCategories());
      } catch (error) {
        console.error('Failed to load user data:', error);
        setError(error);
        // Set default values if loading fails
        setFavorites(new Set());
        setHiddenPrompts(new Set());
        setLists({});
        setSelectedCategories([]);
      } finally {
        // Always set loaded to true, even if there was an error
        setIsLoaded(true);
      }
    };
    
    loadData();
  }, []);

  // Persist data when it changes
  useEffect(() => {
    DataService.saveFavorites(favorites);
  }, [favorites]);

  useEffect(() => {
    DataService.saveHidden(hiddenPrompts);
  }, [hiddenPrompts]);

  useEffect(() => {
    DataService.saveLists(lists);
  }, [lists]);

  useEffect(() => {
    DataService.saveSelectedCategories(selectedCategories);
  }, [selectedCategories]);

  // Helper functions for data manipulation
  const toggleFavorite = (promptText) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(promptText)) {
        newFavorites.delete(promptText);
      } else {
        newFavorites.add(promptText);
      }
      return newFavorites;
    });
  };

  const toggleHidden = (promptText) => {
    setHiddenPrompts(prev => {
      const newHidden = new Set(prev);
      const wasHidden = newHidden.has(promptText);
      if (wasHidden) {
        newHidden.delete(promptText);
      } else {
        newHidden.add(promptText);
      }
      return newHidden;
    });
  };

  const addPromptToList = (listName, promptText) => {
    if (!listName || !promptText) return;
    setLists(prev => {
      const current = prev[listName] || [];
      const nextItems = current.includes(promptText) ? current : [...current, promptText];
      return { ...prev, [listName]: nextItems };
    });
  };

  const removePromptFromList = (listName, promptText) => {
    setLists(prev => {
      const current = prev[listName] || [];
      const nextItems = current.filter(t => t !== promptText);
      return { ...prev, [listName]: nextItems };
    });
  };

  const deleteList = (listName) => {
    setLists(prev => {
      const next = { ...prev };
      delete next[listName];
      return next;
    });
  };

  return {
    // State
    favorites,
    hiddenPrompts,
    lists,
    selectedCategories,
    isLoaded,
    error,
    // Setters
    setFavorites,
    setHiddenPrompts,
    setLists,
    setSelectedCategories,
    // Actions
    toggleFavorite,
    toggleHidden,
    addPromptToList,
    removePromptFromList,
    deleteList
  };
};
