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
  saveFavorites: (favorites) => DataService.saveUserData('favorites', Array.from(favorites)),
  loadFavorites: () => {
    const favorites = DataService.loadUserData('favorites', []);
    return new Set(Array.isArray(favorites) ? favorites : []);
  },
  
  saveHidden: (hidden) => DataService.saveUserData('hidden', Array.from(hidden)),
  loadHidden: () => {
    const hidden = DataService.loadUserData('hidden', []);
    return new Set(Array.isArray(hidden) ? hidden : []);
  },
  
  saveLists: (lists) => DataService.saveUserData('lists', lists),
  loadLists: () => DataService.loadUserData('lists', {}),
  
  saveSelectedCategories: (categories) => DataService.saveUserData('selectedCategories', categories),
  loadSelectedCategories: () => DataService.loadUserData('selectedCategories', [])
};

export default DataService;
