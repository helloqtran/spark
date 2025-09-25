import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { PROMPTS_DATABASE, normalizePromptItem } from '../data/prompts';
import { parseFilterParams } from '../utils/filterUtils';

/**
 * usePromptFilters Hook
 * 
 * Manages all filter state and logic for the prompts page.
 * Extracted from MainPromptsPage to improve maintainability and reusability.
 */
export const usePromptFilters = (lists, hiddenPrompts) => {
  const location = useLocation();
  
  // Filter states
  const [filterTypes, setFilterTypes] = useState(new Set());
  const [filterTags, setFilterTags] = useState(new Set());
  const [filterLists, setFilterLists] = useState(new Set());
  const [excludeTypes, setExcludeTypes] = useState(new Set());
  const [excludeTags, setExcludeTags] = useState(new Set());
  const [excludeLists, setExcludeLists] = useState(new Set());
  const [openDropdown, setOpenDropdown] = useState(null);

  // Read URL parameters and set initial filters
  useEffect(() => {
    const filters = parseFilterParams(new URLSearchParams(location.search));
    setFilterTypes(filters.selectedTypes);
    setExcludeTypes(filters.excludedTypes);
    setFilterTags(filters.selectedTags);
    setExcludeTags(filters.excludedTags);
  }, [location.search]);

  // Memoized filtered prompts to prevent unnecessary recalculations
  const availablePrompts = useMemo(() => {
    // Build the base prompt pool
    let pool = [];

    // If list filters selected, union of those lists
    if (filterLists.size > 0) {
      const texts = Array.from(filterLists).flatMap(listName => lists[listName] || []);
      const uniqueTexts = Array.from(new Set(texts));
      pool = uniqueTexts.map(text => {
        const item = PROMPTS_DATABASE.find(it => it && it.text === text);
        return item ? normalizePromptItem(item) : null;
      }).filter(Boolean);
    } else {
      // Otherwise, pool from all prompts
      pool = PROMPTS_DATABASE.map(item => normalizePromptItem(item));
    }

    // Apply type filters (inclusion)
    const typeSelected = filterTypes.size > 0;
    const typeFiltered = typeSelected
      ? pool.filter(p => p.type && filterTypes.has(p.type))
      : pool;

    // Apply type exclusions
    const typeExcluded = excludeTypes.size > 0;
    const typeExclusionFiltered = typeExcluded
      ? typeFiltered.filter(p => !p.type || !excludeTypes.has(p.type))
      : typeFiltered;

    // Apply tag filters (inclusion)
    const tagSelected = filterTags.size > 0;
    const tagFiltered = tagSelected
      ? typeExclusionFiltered.filter(p => p.tags && p.tags.some(tag => filterTags.has(tag)))
      : typeExclusionFiltered;

    // Apply tag exclusions
    const tagExcluded = excludeTags.size > 0;
    const tagExclusionFiltered = tagExcluded
      ? tagFiltered.filter(p => !p.tags || !p.tags.some(tag => excludeTags.has(tag)))
      : tagFiltered;

    // Exclude hidden
    const filtered = tagExclusionFiltered.filter(p => !hiddenPrompts.has(p.text));
    
    // Shuffle the array to randomize order
    const shuffled = [...filtered];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
  }, [filterTypes, filterTags, filterLists, excludeTypes, excludeTags, excludeLists, lists, hiddenPrompts]);

  // Clear all filters function
  const clearAllFilters = () => {
    setFilterTypes(new Set());
    setFilterTags(new Set());
    setFilterLists(new Set());
    setExcludeTypes(new Set());
    setExcludeTags(new Set());
    setExcludeLists(new Set());
  };

  return {
    // Filter states
    filterTypes,
    setFilterTypes,
    filterTags,
    setFilterTags,
    filterLists,
    setFilterLists,
    excludeTypes,
    setExcludeTypes,
    excludeTags,
    setExcludeTags,
    excludeLists,
    setExcludeLists,
    openDropdown,
    setOpenDropdown,
    
    // Computed values
    availablePrompts,
    
    // Actions
    clearAllFilters
  };
};
