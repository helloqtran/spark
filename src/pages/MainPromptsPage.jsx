import React, { useState, useMemo, useCallback, useEffect } from 'react';
import NavigationBar from '../components/NavigationBar';
import DropdownChip from '../components/DropdownChip';
import PromptCard from '../components/PromptCard';
import BackgroundCard from '../components/BackgroundCard';
import AddToListModal from '../components/AddToListModal';
import WelcomeModal from '../components/WelcomeModal';
import { PROMPTS_DATABASE, normalizePromptItem, getAllTags, getAllTypes } from '../data/prompts';

const MainPromptsPage = ({ 
  favorites, 
  hiddenPrompts, 
  lists, 
  toggleFavorite, 
  toggleHidden,
  addPromptToList,
  setLists,
  handleToggleHidden
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPromptText, setCurrentPromptText] = useState(null);
  const [isAddToListOpen, setIsAddToListOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedListName, setSelectedListName] = useState('');
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  
  // Filters (multi-select) - Main view
  const [filterTypes, setFilterTypes] = useState(new Set());
  const [filterTags, setFilterTags] = useState(new Set());
  const [filterLists, setFilterLists] = useState(new Set());
  
  // Exclusion filters
  const [excludeTypes, setExcludeTypes] = useState(new Set());
  const [excludeTags, setExcludeTags] = useState(new Set());
  const [excludeLists, setExcludeLists] = useState(new Set());
  const [openDropdown, setOpenDropdown] = useState(null);

  // Check for first-time user on component mount
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('spark-has-visited');
    if (!hasVisitedBefore) {
      setIsWelcomeModalOpen(true);
      localStorage.setItem('spark-has-visited', 'true');
    }
  }, []);

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

  // Memoized current prompt - try to find the stored prompt text first
  const currentPrompt = useMemo(() => {
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
  React.useEffect(() => {
    if (currentPrompt) {
      setCurrentPromptText(currentPrompt.text);
    }
  }, [currentPrompt]);

  // Update current prompt when available prompts change
  React.useEffect(() => {
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

  const handleAddToList = useCallback(() => {
    setSelectedListName('');
    setNewListName('');
    setIsAddToListOpen(true);
  }, []);

  const handleCreateList = useCallback(() => {
    const name = newListName.trim();
    if (!name) return;
    if (!lists[name]) {
      setLists(prev => ({ ...prev, [name]: [] }));
    }
    setSelectedListName(name);
    setNewListName('');
  }, [newListName, lists, setLists]);

  const handleAddToListConfirm = useCallback(() => {
    const targetName = selectedListName;
    const promptText = currentPromptText || (currentPrompt && currentPrompt.text);
    if (!targetName || !promptText) return;
    addPromptToList(targetName, promptText);
    setIsAddToListOpen(false);
    setCurrentPromptText(null);
  }, [selectedListName, currentPromptText, currentPrompt, addPromptToList]);

  const handleClearFilters = useCallback(() => {
    setFilterTypes(new Set());
    setFilterTags(new Set());
    setFilterLists(new Set());
    setExcludeTypes(new Set());
    setExcludeTags(new Set());
    setExcludeLists(new Set());
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col overflow-hidden" style={{ background: 'transparent', width: '100vw !important', height: '100vh !important', minHeight: '100vh !important', margin: '0 !important', position: 'fixed !important', top: '0', bottom: '0', left: '0', right: '0', zIndex: 1 }}>
      <NavigationBar 
        favorites={favorites}
        hiddenPrompts={hiddenPrompts}
        lists={lists}
      />


      {/* Main Content Container - Groups Filters and Cards */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 pb-4 pt-8 sm:pt-12">
        {/* Combined Filters and Cards Section */}
        <div className="flex flex-col items-center w-full">
          {/* Filters Section */}
          <div className="flex justify-center items-center mb-6 sm:mb-8">
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
              </div>
              <div className="flex justify-center mt-1">
                <button
                  onClick={handleClearFilters}
                  className="text-sm sm:text-xs px-2 py-1 rounded-full text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 transition-colors"
                  aria-label="Clear all filters"
                >
                  Clear filters
                </button>
              </div>
            </div>
          </div>

          {/* Card and Help Text Container */}
          <div className="flex flex-col items-center w-full max-w-none">
        {/* Card Deck - Vertically Centered */}
        <div className="flex items-center justify-center w-full mb-8">
          {availablePrompts.length === 0 ? (
            <div className="text-center p-8">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">No cards found</h3>
              <p className="text-gray-300 mb-6">
                No cards match your current filters. Try adjusting your filters or clear them to see all cards.
              </p>
              <button
                onClick={handleClearFilters}
                className="text-black px-2 py-1 sm:px-6 sm:py-3 text-xs sm:text-base rounded font-medium transition-colors"
                style={{ backgroundColor: '#D8A159' }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="relative w-[90%] sm:w-[500px] h-[350px] sm:h-[450px]" style={{ height: 'calc(350px + 16px)' }}>
              {/* Background cards */}
              {[1, 2].map((offsetIndex) => {
                const cardIndex = (currentIndex + offsetIndex) % availablePrompts.length;
                const prompt = availablePrompts[cardIndex];
                
                // Only render if we have a valid prompt
                if (!prompt) return null;
                
                return (
                  <BackgroundCard
                    key={`bg-${offsetIndex}-${cardIndex}`}
                    prompt={prompt}
                    offsetIndex={offsetIndex}
                    isAnimating={isAnimating}
                    cardIndex={cardIndex}
                  />
                );
              })}

              {/* Front card */}
              {currentPrompt && (
                <PromptCard
                  prompt={currentPrompt}
                  isAnimating={isAnimating}
                  favorites={favorites}
                  hiddenPrompts={hiddenPrompts}
                  onToggleFavorite={toggleFavorite}
                  onToggleHidden={handleToggleHidden}
                  onAddToList={handleAddToList}
                  onClick={getNewPrompt}
                />
              )}
            </div>
          )}
        </div>

        {/* Help Text - Centered at bottom */}
        {availablePrompts.length > 0 && (
          <div className="flex justify-center items-center">
            <p className="text-sm text-gray-300 text-center">
              Tap or swipe the card to get a new prompt
            </p>
          </div>
        )}

          </div>
        </div>
      </div>

      {/* Add to List Modal */}
      <AddToListModal
        isOpen={isAddToListOpen}
        onClose={() => {
          setIsAddToListOpen(false);
          setCurrentPromptText(null);
        }}
        currentPrompt={currentPromptText ? { text: currentPromptText } : currentPrompt}
        lists={lists}
        selectedListName={selectedListName}
        setSelectedListName={setSelectedListName}
        newListName={newListName}
        setNewListName={setNewListName}
        onAddToList={handleAddToListConfirm}
        onCreateList={handleCreateList}
      />

      {/* Welcome Modal */}
      <WelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={() => setIsWelcomeModalOpen(false)}
      />
    </div>
  );
};

export default MainPromptsPage;
