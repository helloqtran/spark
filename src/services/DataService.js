/**
 * Data Service Layer with Version and Migration Support
 * 
 * This enhanced service handles data migrations automatically,
 * preventing user data loss during app updates.
 */

const DataService = {
  // Current app version for data migration
  VERSION: '1.0.0',
  
  // Storage keys for data
  getStorageKey: (key) => `spark:${key}`,
  
  // Save data with version information
  save: (key, data) => {
    try {
      const wrappedData = {
        version: DataService.VERSION,
        data: data,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem(DataService.getStorageKey(key), JSON.stringify(wrappedData));
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
    }
  },
  
  // Load data with automatic migration
  load: (key, defaultValue = null) => {
    try {
      const stored = localStorage.getItem(DataService.getStorageKey(key));
      if (!stored) return defaultValue;

      const parsed = JSON.parse(stored);
      
      // Check if this is new format (has version wrapper)
      if (parsed && typeof parsed === 'object' && 'version' in parsed) {
        // Run migration if needed
        return DataService._migrateData(parsed, key, defaultValue);
      }
      
      // Legacy format (data stored directly) - migrate
      return DataService._migrateLegacyData(parsed, key, defaultValue);
      
    } catch (error) {
      console.error(`Failed to load ${key}:`, error);
      return defaultValue;
    }
  },
  
  // Handle data migration for versioned data
  _migrateData: (parsed, key, defaultValue) => {
    const { version, data } = parsed;
    
    // If versions match, return data directly
    if (version === DataService.VERSION) {
      return data;
    }
    
    // Handle migration based on key and version
    switch (key) {
      case 'favorites':
        return DataService._migrateFavorites(data, version);
      case 'lists':
        return DataService._migrateLists(data, version);
      case 'selectedCategories':
        return DataService._migrateCategories(data, version);
      default:
        return data || defaultValue;
    }
  },
  
  // Handle legacy data migration from direct storage format
  _migrateLegacyData: (legacyData, key, defaultValue) => {
    console.log(`Migrating legacy ${key} data...`);
    
    switch (key) {
      case 'favorites':
        // Legacy: might be array directly stored
        const favorites = Array.isArray(legacyData) ? legacyData : [];
        
        // If we successfully loaded legacy data, save it in new format
        if (favorites.length > 0) {
          DataService.save(key, favorites);
        }
        
        return favorites;
      case 'lists':
        // Legacy: ensure object format
        const lists = (legacyData && typeof legacyData === 'object') ? legacyData : {};
        
        // If we successfully loaded legacy data, save it in new format
        if (Object.keys(lists).length > 0) {
          DataService.save(key, lists);
        }
        
        return lists;
      case 'selectedCategories':
        const categories = Array.isArray(legacyData) ? legacyData : [];
        
        // If we successfully loaded legacy data, save it in new format
        if (categories.length > 0) {
          DataService.save(key, categories);
        }
        
        return categories;
      default:
        return legacyData || defaultValue;
    }
  },
  
  // Migration functions for version-specific changes
  _migrateFavorites: (data, fromVersion) => {
    // Handle potential format changes in favorites
    return Array.isArray(data) ? data : [];
  },
  
  _migrateLists: (data, fromVersion) => {
    // Handle list format changes if needed for future versions
    
    if (!data || typeof data !== 'object') return {};
    
    // Example: Handle potential future list structure changes
    if (Array.isArray(data.lists)) {
      const newLists = {};
      data.lists.forEach(list => {
        newLists[list.name] = list.items || [];
      });
      return newLists;
    }
    
    return data;
  },
  
  _migrateCategories: (data, fromVersion) => {
    // Handle category format changes if needed for future versions
    return Array.isArray(data) ? data : [];
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