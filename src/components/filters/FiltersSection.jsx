import React from 'react';
import { X } from 'lucide-react';
import DropdownChip from '../DropdownChip';
import { getAllTags, getAllTypes } from '../../data/prompts';

/**
 * FiltersSection Component
 * 
 * Handles the display and interaction of all filter dropdowns.
 * Extracted from MainPromptsPage to improve maintainability.
 */
const FiltersSection = React.memo(({ 
  filterTypes, 
  setFilterTypes, 
  excludeTypes, 
  setExcludeTypes,
  filterTags, 
  setFilterTags, 
  excludeTags, 
  setExcludeTags,
  filterLists, 
  setFilterLists, 
  excludeLists, 
  setExcludeLists,
  lists,
  openDropdown,
  setOpenDropdown,
  onClearFilters,
  showCustomListsFilter = true
}) => {
  const hasActiveFilters = filterTypes.size > 0 || filterTags.size > 0 || 
                          (showCustomListsFilter && filterLists.size > 0) || 
                          excludeTypes.size > 0 || excludeTags.size > 0 || 
                          (showCustomListsFilter && excludeLists.size > 0);

  return (
    <div className="flex justify-center items-center mb-8 sm:mb-12">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-3">
          <h2 className="text-sm sm:text-xs font-medium text-gray-300 uppercase tracking-wide">Filters</h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <DropdownChip
            label="Type"
            options={getAllTypes()}
            selected={filterTypes}
            excluded={excludeTypes}
            onToggle={(id, action) => {
              if (action === 'include') {
                setFilterTypes(prev => new Set([...prev, id]));
                setExcludeTypes(prev => {
                  const next = new Set(prev);
                  next.delete(id);
                  return next;
                });
              } else if (action === 'exclude') {
                setFilterTypes(prev => {
                  const next = new Set(prev);
                  next.delete(id);
                  return next;
                });
                setExcludeTypes(prev => new Set([...prev, id]));
              } else if (action === 'clear') {
                setFilterTypes(prev => {
                  const next = new Set(prev);
                  next.delete(id);
                  return next;
                });
                setExcludeTypes(prev => {
                  const next = new Set(prev);
                  next.delete(id);
                  return next;
                });
              }
            }}
            onClear={() => { setFilterTypes(new Set()); setExcludeTypes(new Set()); }}
            onOpenChange={(open) => setOpenDropdown(open ? 'type' : null)}
            isOpen={openDropdown === 'type'}
            dropdownId="type"
          />
          <DropdownChip
            label="Tags"
            options={getAllTags().map(tag => ({ id: tag, label: tag }))}
            selected={filterTags}
            excluded={excludeTags}
            onToggle={(id, action) => {
              if (action === 'include') {
                setFilterTags(prev => new Set([...prev, id]));
                setExcludeTags(prev => {
                  const next = new Set(prev);
                  next.delete(id);
                  return next;
                });
              } else if (action === 'exclude') {
                setFilterTags(prev => {
                  const next = new Set(prev);
                  next.delete(id);
                  return next;
                });
                setExcludeTags(prev => new Set([...prev, id]));
              } else if (action === 'clear') {
                setFilterTags(prev => {
                  const next = new Set(prev);
                  next.delete(id);
                  return next;
                });
                setExcludeTags(prev => {
                  const next = new Set(prev);
                  next.delete(id);
                  return next;
                });
              }
            }}
            onClear={() => { setFilterTags(new Set()); setExcludeTags(new Set()); }}
            onOpenChange={(open) => setOpenDropdown(open ? 'tags' : null)}
            isOpen={openDropdown === 'tags'}
            dropdownId="tags"
          />
          {showCustomListsFilter && (
            <DropdownChip
              label="Custom Lists"
              options={Object.keys(lists).map(n => ({ id: n, label: n }))}
              selected={filterLists}
              excluded={excludeLists}
              onToggle={(id, action) => {
                if (action === 'include') {
                  setFilterLists(prev => new Set([...prev, id]));
                  setExcludeLists(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                  });
                } else if (action === 'exclude') {
                  setFilterLists(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                  });
                  setExcludeLists(prev => new Set([...prev, id]));
                } else if (action === 'clear') {
                  setFilterLists(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                  });
                  setExcludeLists(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                  });
                }
              }}
              onClear={() => { setFilterLists(new Set()); setExcludeLists(new Set()); }}
              onOpenChange={(open) => setOpenDropdown(open ? 'lists' : null)}
              isOpen={openDropdown === 'lists'}
              dropdownId="lists"
            />
          )}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm p-2 rounded-full border border-red-400 text-red-400 hover:text-red-300 hover:bg-red-900/20 hover:border-red-300 transition-colors flex items-center justify-center"
              aria-label="Clear all filters"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

FiltersSection.displayName = 'FiltersSection';

export default FiltersSection;
