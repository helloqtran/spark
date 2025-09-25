import { useState, useMemo } from 'react';
import { PROMPTS_DATABASE, normalizePromptItem } from '../data/prompts';

/**
 * useAllPromptsFilters Hook
 * 
 * Manages filter state and logic specifically for the AllPromptsPage.
 * Similar to usePromptFilters but for the all prompts view.
 */
export const useAllPromptsFilters = (hiddenPrompts) => {
  // Filter states
  const [filterTypes, setFilterTypes] = useState(new Set());
  const [filterTags, setFilterTags] = useState(new Set());
  const [filterLists, setFilterLists] = useState(new Set());
  const [excludeTypes, setExcludeTypes] = useState(new Set());
  const [excludeTags, setExcludeTags] = useState(new Set());
  const [excludeLists, setExcludeLists] = useState(new Set());
  const [openDropdown, setOpenDropdown] = useState(null);

  // Memoized filtered prompts to prevent unnecessary recalculations
  const availablePrompts = useMemo(() => {
    // Build the base prompt pool from all prompts
    let pool = PROMPTS_DATABASE.map(item => normalizePromptItem(item));

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
    
    return filtered;
  }, [filterTypes, filterTags, filterLists, excludeTypes, excludeTags, excludeLists, hiddenPrompts]);

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
