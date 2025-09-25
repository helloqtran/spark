/**
 * Filter Utilities
 * 
 * Shared utility functions for handling filter logic across components.
 * Eliminates code duplication and provides consistent behavior.
 */

/**
 * Creates a three-state toggle function for filters
 * 
 * @param {Set} selected - Currently selected items
 * @param {Set} excluded - Currently excluded items  
 * @param {Function} setSelected - Function to update selected items
 * @param {Function} setExcluded - Function to update excluded items
 * @returns {Function} Toggle function that cycles through: unselected → included → excluded → unselected
 */
export const createThreeStateToggle = (selected, excluded, setSelected, setExcluded) => {
  return (id) => {
    if (selected.has(id)) {
      // Currently included, move to excluded
      setSelected(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
      setExcluded(prev => new Set([...prev, id]));
    } else if (excluded.has(id)) {
      // Currently excluded, move to unselected
      setExcluded(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } else {
      // Currently unselected, move to included
      setSelected(prev => new Set([...prev, id]));
    }
  };
};

/**
 * Creates a two-state toggle function for simple filters
 * 
 * @param {Set} selected - Currently selected items
 * @param {Function} setSelected - Function to update selected items
 * @returns {Function} Toggle function that cycles through: unselected → selected → unselected
 */
export const createTwoStateToggle = (selected, setSelected) => {
  return (id) => {
    setSelected(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };
};

/**
 * Clears all filters (both selected and excluded)
 * 
 * @param {Function} setSelected - Function to clear selected items
 * @param {Function} setExcluded - Function to clear excluded items
 */
export const clearAllFilters = (setSelected, setExcluded) => {
  setSelected(new Set());
  setExcluded(new Set());
};

/**
 * Gets the current state of a filter item
 * 
 * @param {string} id - Item ID to check
 * @param {Set} selected - Currently selected items
 * @param {Set} excluded - Currently excluded items
 * @returns {string} 'included', 'excluded', or 'unchecked'
 */
export const getFilterState = (id, selected, excluded) => {
  if (selected.has(id)) return 'included';
  if (excluded.has(id)) return 'excluded';
  return 'unchecked';
};

/**
 * Creates URL search parameters from filter state
 * 
 * @param {Object} filters - Filter state object
 * @returns {URLSearchParams} URL search parameters
 */
export const createFilterParams = (filters) => {
  const params = new URLSearchParams();
  
  if (filters.selectedTypes?.size > 0) {
    params.set('includeTypes', Array.from(filters.selectedTypes).join(','));
  }
  
  if (filters.excludedTypes?.size > 0) {
    params.set('excludeTypes', Array.from(filters.excludedTypes).join(','));
  }
  
  if (filters.selectedTags?.size > 0) {
    params.set('includeTags', Array.from(filters.selectedTags).join(','));
  }
  
  if (filters.excludedTags?.size > 0) {
    params.set('excludeTags', Array.from(filters.excludedTags).join(','));
  }
  
  return params;
};

/**
 * Parses URL search parameters into filter state
 * 
 * @param {URLSearchParams} searchParams - URL search parameters
 * @returns {Object} Filter state object
 */
export const parseFilterParams = (searchParams) => {
  const filters = {
    selectedTypes: new Set(),
    excludedTypes: new Set(),
    selectedTags: new Set(),
    excludedTags: new Set(),
  };
  
  const includeTypes = searchParams.get('includeTypes');
  if (includeTypes) {
    filters.selectedTypes = new Set(includeTypes.split(','));
  }
  
  const excludeTypes = searchParams.get('excludeTypes');
  if (excludeTypes) {
    filters.excludedTypes = new Set(excludeTypes.split(','));
  }
  
  const includeTags = searchParams.get('includeTags');
  if (includeTags) {
    filters.selectedTags = new Set(includeTags.split(','));
  }
  
  const excludeTags = searchParams.get('excludeTags');
  if (excludeTags) {
    filters.excludedTags = new Set(excludeTags.split(','));
  }
  
  return filters;
};
