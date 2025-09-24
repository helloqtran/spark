/**
 * Data Service Layer - prepares for future user authentication
 * 
 * This service handles all data persistence operations and can be easily
 * modified to support user authentication by updating the storage key
 * generation and switching from localStorage to API calls.
 */

const DataService = {
  // User data keys - can be modified later to include user ID
  getStorageKey: (key) => `spark:${key}`,
  
  // Generic storage operations
  save: (key, data) => {
    try {
      localStorage.setItem(DataService.getStorageKey(key), JSON.stringify(data));
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
    }
  },
  
  load: (key, defaultValue = null) => {
    try {
      const stored = localStorage.getItem(DataService.getStorageKey(key));
      return stored ? JSON.parse(stored) : defaultValue;
    } catch (error) {
      console.error(`Failed to load ${key}:`, error);
      return defaultValue;
    }
  },
  
  // User-specific data operations
  saveUserData: (dataType, data) => {
    DataService.save(dataType, data);
  },
  
  loadUserData: (dataType, defaultValue = null) => {
    return DataService.load(dataType, defaultValue);
  },
  
  // Specific data operations
  saveFavorites: (favorites) => {
    try {
      DataService.saveUserData('favorites', Array.from(favorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  },
  loadFavorites: () => {
    try {
      const favorites = DataService.loadUserData('favorites', []);
      return new Set(Array.isArray(favorites) ? favorites : []);
    } catch (error) {
      console.error('Failed to load favorites:', error);
      return new Set();
    }
  },
  
  saveHidden: (hidden) => {
    try {
      DataService.saveUserData('hidden', Array.from(hidden));
    } catch (error) {
      console.error('Failed to save hidden prompts:', error);
    }
  },
  loadHidden: () => {
    try {
      const hidden = DataService.loadUserData('hidden', []);
      return new Set(Array.isArray(hidden) ? hidden : []);
    } catch (error) {
      console.error('Failed to load hidden prompts:', error);
      return new Set();
    }
  },
  
  saveLists: (lists) => {
    try {
      DataService.saveUserData('lists', lists);
    } catch (error) {
      console.error('Failed to save lists:', error);
    }
  },
  loadLists: () => {
    try {
      const lists = DataService.loadUserData('lists', {});
      return typeof lists === 'object' && lists !== null ? lists : {};
    } catch (error) {
      console.error('Failed to load lists:', error);
      return {};
    }
  },
  
  saveSelectedCategories: (categories) => {
    try {
      DataService.saveUserData('selectedCategories', categories);
    } catch (error) {
      console.error('Failed to save selected categories:', error);
    }
  },
  loadSelectedCategories: () => {
    try {
      const categories = DataService.loadUserData('selectedCategories', []);
      return Array.isArray(categories) ? categories : [];
    } catch (error) {
      console.error('Failed to load selected categories:', error);
      return [];
    }
  }
};

export default DataService;
