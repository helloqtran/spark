import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronRight, Heart, EyeOff, Plus } from 'lucide-react';

// Import extracted components and utilities
import NavigationBar from './components/NavigationBar';
import DropdownChip from './components/DropdownChip';
import PromptCard from './components/PromptCard';
import BackgroundCard from './components/BackgroundCard';
import AddToListModal from './components/AddToListModal';
import { useUserData } from './hooks/useUserData';
import { PROMPTS_DATABASE, normalizePromptItem, getAllTags, getAllTypes } from './data/prompts';

const SparkApp = () => {
  // Use the centralized user data management
  const userData = useUserData();
  const {
    favorites,
    hiddenPrompts,
    lists,
    selectedCategories,
    setSelectedCategories,
    setLists,
    toggleFavorite,
    toggleHidden,
    addPromptToList,
    removePromptFromList,
    deleteList
  } = userData;

  // App-specific state
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPromptText, setCurrentPromptText] = useState(null); // Store current prompt text
  const [isAddToListOpen, setIsAddToListOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedListName, setSelectedListName] = useState('');
  
  // Filters (multi-select) - Main view
  const [filterTypes, setFilterTypes] = useState(new Set());
  const [filterTags, setFilterTags] = useState(new Set());
  const [filterLists, setFilterLists] = useState(new Set());
  const [openDropdown, setOpenDropdown] = useState(null);
  
  // Filters (multi-select) - All Prompts view
  const [allPromptsFilterTypes, setAllPromptsFilterTypes] = useState(new Set());
  const [allPromptsFilterTags, setAllPromptsFilterTags] = useState(new Set());
  const [allPromptsFilterLists, setAllPromptsFilterLists] = useState(new Set());
  const [allPromptsOpenDropdown, setAllPromptsOpenDropdown] = useState(null);

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

    // Apply type filters
    const typeSelected = filterTypes.size > 0;
    const typeFiltered = typeSelected
      ? pool.filter(p => p.type && filterTypes.has(p.type))
      : pool;

    // Apply tag filters
    const tagSelected = filterTags.size > 0;
    const tagFiltered = tagSelected
      ? typeFiltered.filter(p => p.tags && p.tags.some(tag => filterTags.has(tag)))
      : typeFiltered;

    // Exclude hidden
    return tagFiltered.filter(p => !hiddenPrompts.has(p.text));
  }, [filterTypes, filterTags, filterLists, lists, hiddenPrompts]);

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

  const handleSwipe = useCallback(() => getNewPrompt(), [getNewPrompt]);

  // Enhanced toggleHidden with card advancement logic
  const handleToggleHidden = useCallback((promptText) => {
    const wasHidden = hiddenPrompts.has(promptText);
    toggleHidden(promptText);
    
    // If we're hiding the current prompt, advance to the next card immediately
    if (!wasHidden && currentPrompt && currentPrompt.text === promptText) {
      // Find the next available prompt
      const currentIndexInAvailable = availablePrompts.findIndex(p => p.text === promptText);
      if (currentIndexInAvailable !== -1) {
        const nextIndex = (currentIndexInAvailable + 1) % availablePrompts.length;
        // Temporarily remove the hidden prompt to get the next available one
        const tempAvailable = availablePrompts.filter(p => p.text !== promptText);
        if (tempAvailable.length > 0) {
          const nextPrompt = tempAvailable[nextIndex % tempAvailable.length];
          setCurrentIndex(nextIndex % tempAvailable.length);
        }
      }
    }
  }, [hiddenPrompts, toggleHidden, currentPrompt, availablePrompts]);

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
  }, []);

  // Welcome Screen (CTA only)
  if (currentScreen === 'welcome') {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center p-6 text-center" style={{ background: 'radial-gradient(ellipse at bottom right, #D8A159 0%, #D8A159 10%, #B88A4A 20%, #8A6B2F 30%, #4A3A1A 40%, #000000 50%)', width: '100vw !important', height: '100vh !important', margin: '0 !important' }}>
        <div className="max-w-md">
          <h1 className="text-8xl font-bold mb-16 text-white tracking-wide spark-font">SPARK</h1>
          <p className="text-gray-300 mb-8">
            Get inspired with movement prompts designed to spark creativity in your freestyle practice.
          </p>
          <button 
            onClick={() => setCurrentScreen('prompts')}
            className="text-black px-10 py-4 rounded-lg font-medium flex items-center gap-3 mx-auto transition-colors text-lg"
            style={{ backgroundColor: '#D8A159' }}
          >
            Get Started
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    );
  }

  // Favorites Screen
  if (currentScreen === 'favorites') {
    const favoritePrompts = Array.from(favorites).map(text => {
      return { text };
    });

    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col" style={{ background: 'radial-gradient(ellipse at bottom right, #D8A159 0%, #D8A159 10%, #B88A4A 20%, #8A6B2F 30%, #4A3A1A 40%, #000000 50%)', width: '100vw !important', height: '100vh !important', margin: '0 !important' }}>
        <NavigationBar 
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          favorites={favorites}
          hiddenPrompts={hiddenPrompts}
        />

        {/* Page Title */}
        <div className="bg-black py-8 relative z-40 pt-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-white text-center">My Favorites</h1>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="p-6 max-w-4xl mx-auto w-full pb-8">
            {favoritePrompts.length === 0 ? (
              <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                <div className="text-center py-12">
                  <Heart size={48} className="mx-auto text-gray-500 mb-4" />
                  <p className="text-gray-300">No favorites yet</p>
                  <p className="text-sm text-gray-400 mt-2">Tap the heart icon on prompts to add them here</p>
                </div>
              </div>
            ) : (
              <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10">
                {favoritePrompts.map((prompt, index) => (
                  <div key={prompt.text} className={`px-6 py-4 hover:bg-white/5 transition-colors ${index !== favoritePrompts.length - 1 ? 'border-b border-white/10' : ''}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-white text-sm leading-relaxed break-words">{prompt.text}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0 self-center">
                        <button
                          onClick={() => toggleFavorite(prompt.text)}
                          className="p-3 hover:bg-white/10 rounded-full transition-colors"
                          title="Remove from favorites"
                        >
                          <Heart size={20} className="fill-pink-500 text-pink-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Hidden Screen
  if (currentScreen === 'hidden') {
    const hiddenPromptsList = Array.from(hiddenPrompts).map(text => ({
      text,
    }));

    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col" style={{ background: 'radial-gradient(ellipse at bottom right, #D8A159 0%, #D8A159 10%, #B88A4A 20%, #8A6B2F 30%, #4A3A1A 40%, #000000 50%)', width: '100vw !important', height: '100vh !important', margin: '0 !important' }}>
        <NavigationBar 
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          favorites={favorites}
          hiddenPrompts={hiddenPrompts}
        />

        {/* Page Title */}
        <div className="bg-black py-8 relative z-40 pt-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-white text-center mb-4">Hidden Prompts</h1>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="p-6 max-w-4xl mx-auto w-full space-y-16 pb-8">
            {hiddenPromptsList.length === 0 ? (
              <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                <div className="text-center py-12">
                  <EyeOff size={48} className="mx-auto text-gray-500 mb-4" />
                  <p className="text-gray-300">No hidden prompts</p>
                  <p className="text-sm text-gray-400 mt-2">Tap the eye icon on prompts to hide them</p>
                </div>
              </div>
            ) : (
              <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10">
                {hiddenPromptsList.map((prompt, index) => (
                  <div key={prompt.text} className={`px-6 py-4 hover:bg-white/5 transition-colors ${index !== hiddenPromptsList.length - 1 ? 'border-b border-white/10' : ''}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0 pr-4">
                        <p className="text-white text-sm leading-relaxed break-words">{prompt.text}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0 self-center">
                        <button
                          onClick={() => handleToggleHidden(prompt.text)}
                          className="p-3 hover:bg-white/10 rounded-full transition-colors"
                          title="Show prompt"
                        >
                          <EyeOff size={20} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // About Screen
  if (currentScreen === 'about') {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 flex flex-col" style={{ background: 'radial-gradient(ellipse at bottom right, #D8A159 0%, #D8A159 10%, #B88A4A 20%, #8A6B2F 30%, #4A3A1A 40%, #000000 50%)', width: '100vw !important', height: '100vh !important', margin: '0 !important' }}>
        <NavigationBar 
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          favorites={favorites}
          hiddenPrompts={hiddenPrompts}
        />

        {/* Page Title */}
        <div className="bg-black py-8 relative z-40 pt-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-white text-center">About Spark</h1>
          </div>
        </div>

        {/* About Content */}
        <div className="flex-1 p-6 max-w-2xl mx-auto w-full relative z-10">
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="space-y-4">
              <p className="text-white leading-relaxed">
                Spark was ~vibecoded~ with love by <a href="https://www.instagram.com/pole_teenie" target="_blank" rel="noopener noreferrer" className="underline transition-colors font-medium" style={{ color: '#D8A159' }} onMouseEnter={(e) => e.target.style.color = '#B88A4A'} onMouseLeave={(e) => e.target.style.color = '#D8A159'}>@pole_teenie</a> and <a href="https://cursor.com" target="_blank" rel="noopener noreferrer" className="underline transition-colors font-medium" style={{ color: '#D8A159' }} onMouseEnter={(e) => e.target.style.color = '#B88A4A'} onMouseLeave={(e) => e.target.style.color = '#D8A159'}>Cursor</a> <Heart size={16} className="inline fill-pink-500 text-pink-500 ml-1" />
              </p>
              
                <p className="text-white leading-relaxed">
                  DM <a href="https://www.instagram.com/sparkflow.dance" target="_blank" rel="noopener noreferrer" className="underline transition-colors font-medium" style={{ color: '#D8A159' }} onMouseEnter={(e) => e.target.style.color = '#B88A4A'} onMouseLeave={(e) => e.target.style.color = '#D8A159'}>@sparkflow.dance</a> or email <a href="mailto:hello@sparkflow.dance" className="underline transition-colors font-medium" style={{ color: '#D8A159' }} onMouseEnter={(e) => e.target.style.color = '#B88A4A'} onMouseLeave={(e) => e.target.style.color = '#D8A159'}>hello@sparkflow.dance</a> to share your favorite prompts and let me know how I can make Spark even better!
                </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // All Prompts Screen
  if (currentScreen === 'all-prompts') {
    // Apply the same filtering logic as the main screen, but include hidden prompts
    let allPrompts = [];

    // If list filters selected, union of those lists
    if (allPromptsFilterLists.size > 0) {
      const texts = Array.from(allPromptsFilterLists).flatMap(listName => lists[listName] || []);
      const uniqueTexts = Array.from(new Set(texts));
      allPrompts = uniqueTexts.map(text => {
        const item = PROMPTS_DATABASE.find(it => it && it.text === text);
        return item ? normalizePromptItem(item) : null;
      }).filter(Boolean);
    } else {
      // Otherwise, pool from all prompts
      allPrompts = PROMPTS_DATABASE.map(item => normalizePromptItem(item));
    }

    // Apply type filters
    const typeSelected = allPromptsFilterTypes.size > 0;
    if (typeSelected) {
      allPrompts = allPrompts.filter(p => p.type && allPromptsFilterTypes.has(p.type));
    }

    // Apply tag filters
    const tagSelected = allPromptsFilterTags.size > 0;
    if (tagSelected) {
      allPrompts = allPrompts.filter(p => p.tags && p.tags.some(tag => allPromptsFilterTags.has(tag)));
    }

    // Note: We don't exclude hidden prompts on this screen, we just mark them

    return (
      <div className="full-viewport w-full flex flex-col" style={{ background: 'radial-gradient(ellipse at bottom right, #D8A159 0%, #D8A159 10%, #B88A4A 20%, #8A6B2F 30%, #4A3A1A 40%, #000000 50%)', minHeight: '100vh', minHeight: '100dvh', minHeight: '100svh', height: '100vh', height: '100dvh', height: '100svh' }}>
        <NavigationBar 
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          favorites={favorites}
          hiddenPrompts={hiddenPrompts}
        />

        {/* Page Title */}
        <div className="bg-black py-8 relative z-40 pt-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-white text-center">All Prompts</h1>
            <p className="text-gray-300 text-sm mt-2">
              {allPrompts.length} prompts available
              {(allPromptsFilterTypes.size > 0 || allPromptsFilterTags.size > 0 || allPromptsFilterLists.size > 0) && (
                <span style={{ color: '#D8A159' }}> (filtered)</span>
              )}
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex justify-center items-center pt-4 pb-4 px-4 sm:px-0 bg-black">
          <div className="w-full max-w-4xl">
            <div className="text-center mb-3">
              <h2 className="text-sm font-medium text-gray-300 uppercase tracking-wide">Filters</h2>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <DropdownChip
                label="Type"
                options={getAllTypes()}
                selected={allPromptsFilterTypes}
                onToggle={(id) => setAllPromptsFilterTypes(prev => { 
                  const next = new Set(prev); 
                  next.has(id) ? next.delete(id) : next.add(id); 
                  return next; 
                })}
                onClear={() => setAllPromptsFilterTypes(new Set())}
                onOpenChange={(open) => setAllPromptsOpenDropdown(open ? 'type' : null)}
                isOpen={allPromptsOpenDropdown === 'type'}
                dropdownId="type"
              />
              <DropdownChip
                label="Tags"
                options={getAllTags().map(tag => ({ id: tag, label: tag }))}
                selected={allPromptsFilterTags}
                onToggle={(id) => setAllPromptsFilterTags(prev => { 
                  const next = new Set(prev); 
                  next.has(id) ? next.delete(id) : next.add(id); 
                  return next; 
                })}
                onClear={() => setAllPromptsFilterTags(new Set())}
                onOpenChange={(open) => setAllPromptsOpenDropdown(open ? 'tags' : null)}
                isOpen={allPromptsOpenDropdown === 'tags'}
                dropdownId="tags"
              />
              <DropdownChip
                label="Custom Lists"
                options={Object.keys(lists).map(n => ({ id: n, label: n }))}
                selected={allPromptsFilterLists}
                onToggle={(id) => setAllPromptsFilterLists(prev => { 
                  const next = new Set(prev); 
                  next.has(id) ? next.delete(id) : next.add(id); 
                  return next; 
                })}
                onClear={() => setAllPromptsFilterLists(new Set())}
                onOpenChange={(open) => setAllPromptsOpenDropdown(open ? 'lists' : null)}
                isOpen={allPromptsOpenDropdown === 'lists'}
                dropdownId="lists"
              />
            </div>
            <div className="flex justify-center mt-3">
              <button
                onClick={() => {
                  setAllPromptsFilterTypes(new Set());
                  setAllPromptsFilterTags(new Set());
                  setAllPromptsFilterLists(new Set());
                }}
                className="text-base px-3 py-2 rounded-full text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 transition-colors"
                aria-label="Clear all filters"
              >
                Clear filters
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable content area */}
        <div 
          className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#D8A159 #1f2937'
          }}
        >
          <div className="p-4 sm:p-6 max-w-4xl mx-auto w-full pb-8">
          <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10">
            {allPrompts.map((prompt, index) => {
              const isHidden = hiddenPrompts.has(prompt.text);
              return (
                <div key={prompt.text} className={`px-6 py-4 hover:bg-white/5 transition-colors ${index !== allPrompts.length - 1 ? 'border-b border-white/10' : ''} ${isHidden ? 'opacity-50' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className={`text-base leading-relaxed break-words ${isHidden ? 'text-gray-400' : 'text-white'}`}>{prompt.text}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {prompt.type && (
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${isHidden ? 'bg-gray-600 text-gray-300' : ''}`} style={!isHidden ? { backgroundColor: '#D8A159', color: 'black' } : {}}>
                            {prompt.type}
                          </span>
                        )}
                        {prompt.tags && prompt.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className={`px-2 py-1 text-xs rounded-full ${isHidden ? 'bg-gray-600/50 text-gray-400' : 'bg-white/20 text-gray-300'}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0 self-center">
                      <button
                        onClick={() => toggleFavorite(prompt.text)}
                        className="p-3 hover:bg-white/10 rounded-full transition-colors"
                        title="Toggle favorite"
                      >
                        <Heart size={20} className={favorites.has(prompt.text) ? "fill-pink-500 text-pink-500" : "text-gray-400"} />
                      </button>
                      <button
                        onClick={() => handleToggleHidden(prompt.text)}
                        className="p-3 hover:bg-white/10 rounded-full transition-colors"
                        title={isHidden ? "Show prompt" : "Hide prompt"}
                      >
                        <EyeOff size={20} className={isHidden ? "text-red-400" : "text-gray-400"} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedListName('');
                          setNewListName('');
                          setCurrentPromptText(prompt.text);
                          setIsAddToListOpen(true);
                        }}
                        className="p-3 hover:bg-white/10 rounded-full transition-colors"
                        title="Add to list"
                      >
                        <Plus size={20} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
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
      </div>
    );
  }

  // Lists Screen
  if (currentScreen === 'lists') {
    const listNames = Object.keys(lists);
    return (
      <div className="full-viewport w-full flex flex-col" style={{ background: 'radial-gradient(ellipse at bottom right, #D8A159 0%, #D8A159 10%, #B88A4A 20%, #8A6B2F 30%, #4A3A1A 40%, #000000 50%)', minHeight: '100vh', minHeight: '100dvh', minHeight: '100svh', height: '100vh', height: '100dvh', height: '100svh' }}>
        {/* Fixed background elements */}
        <NavigationBar 
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          favorites={favorites}
          hiddenPrompts={hiddenPrompts}
        />

        {/* Page Title */}
        <div className="bg-black py-8 relative z-40 pt-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-2xl font-bold text-white text-center">Custom Lists</h1>
            <button
              onClick={() => {
                setSelectedListName('');
                setNewListName('');
                setIsAddToListOpen(true);
              }}
              className="mt-4 px-6 py-3 text-base font-medium rounded-lg text-black transition-colors mx-auto block"
              style={{ backgroundColor: '#D8A159' }}
            >
              Create New List
            </button>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="p-4 sm:p-6 max-w-4xl mx-auto w-full space-y-16 pb-8">
          {listNames.length === 0 ? (
            <div className="text-center py-12 text-base text-gray-300">No custom lists yet.</div>
          ) : (
            listNames.map((name, index) => {
              const items = lists[name] || [];
              return (
                <div key={name} className="space-y-4">
                  {/* Visual separator between lists */}
                  {index > 0 && (
                    <div className="border-t border-gray-600 -mt-8 mb-8"></div>
                  )}
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">{name} <span className="text-gray-400 text-sm font-normal">({items.length})</span></h2>
                    <button
                      onClick={() => deleteList(name)}
                      className="text-base px-4 py-2 rounded-lg border border-red-500/50 text-red-300 bg-black/20 hover:bg-red-500/20 hover:border-red-500/70 hover:text-red-200 transition-colors backdrop-blur-sm"
                    >
                      Delete list
                    </button>
                  </div>
                  
                  {items.length === 0 ? (
                    <div className="text-sm text-gray-400 pl-2">No prompts yet.</div>
                  ) : (
                    <div className="space-y-2">
                      {items.map(text => {
                        return (
                          <div key={text} className="flex items-start justify-between py-3 px-4 rounded-lg hover:bg-white/5 transition-colors group">
                            <div className="flex-1 pr-4 min-w-0">
                              <div className="text-base text-gray-200 leading-relaxed break-words">{text}</div>
                            </div>
                            <button
                              onClick={() => removePromptFromList(name, text)}
                              className="text-base px-4 py-2 rounded-lg border border-gray-600 text-gray-400 hover:bg-gray-600/20 hover:border-gray-500 hover:text-gray-300 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              Remove
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
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
      </div>
    );
  }

  // Main Prompts Screen with deck-style cards
  return (
    <div className="full-viewport flex flex-col overflow-hidden" style={{ background: 'radial-gradient(ellipse at bottom right, #D8A159 0%, #D8A159 10%, #B88A4A 20%, #8A6B2F 30%, #4A3A1A 40%, #000000 50%)', minHeight: '100vh', minHeight: '100dvh', minHeight: '100svh', height: '100vh', height: '100dvh', height: '100svh' }}>
      <NavigationBar 
        currentScreen={currentScreen}
        setCurrentScreen={setCurrentScreen}
        favorites={favorites}
        hiddenPrompts={hiddenPrompts}
      />

      {/* Filters Section */}
      <div className="flex justify-center items-center pt-24 pb-0 px-4 sm:px-0">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-3">
            <h2 className="text-sm sm:text-xs font-medium text-gray-300 uppercase tracking-wide">Filters</h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <DropdownChip
              label="Type"
              options={getAllTypes()}
              selected={filterTypes}
              onToggle={(id) => setFilterTypes(prev => { 
                const next = new Set(prev); 
                next.has(id) ? next.delete(id) : next.add(id); 
                return next; 
              })}
              onClear={() => setFilterTypes(new Set())}
              onOpenChange={(open) => setOpenDropdown(open ? 'type' : null)}
              isOpen={openDropdown === 'type'}
              dropdownId="type"
            />
            <DropdownChip
              label="Tags"
              options={getAllTags().map(tag => ({ id: tag, label: tag }))}
              selected={filterTags}
              onToggle={(id) => setFilterTags(prev => { 
                const next = new Set(prev); 
                next.has(id) ? next.delete(id) : next.add(id); 
                return next; 
              })}
              onClear={() => setFilterTags(new Set())}
              onOpenChange={(open) => setOpenDropdown(open ? 'tags' : null)}
              isOpen={openDropdown === 'tags'}
              dropdownId="tags"
            />
            <DropdownChip
              label="Custom Lists"
              options={Object.keys(lists).map(n => ({ id: n, label: n }))}
              selected={filterLists}
              onToggle={(id) => setFilterLists(prev => { 
                const next = new Set(prev); 
                next.has(id) ? next.delete(id) : next.add(id); 
                return next; 
              })}
              onClear={() => setFilterLists(new Set())}
              onOpenChange={(open) => setOpenDropdown(open ? 'lists' : null)}
              isOpen={openDropdown === 'lists'}
              dropdownId="lists"
            />
          </div>
          <div className="flex justify-center mt-3">
            <button
              onClick={handleClearFilters}
              className="text-base px-3 py-2 rounded-full text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 transition-colors"
              aria-label="Clear all filters"
            >
              Clear filters
            </button>
          </div>
        </div>
      </div>

      {/* Card and Help Text Container */}
      <div className="flex-1 flex flex-col justify-center items-center px-4">
        {/* Card Deck - Vertically Centered */}
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="relative w-[85%] sm:w-[500px] h-[400px] sm:h-[500px]" style={{ height: 'calc(400px + 16px)' }}>
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
        </div>

        {/* Help Text - Centered at bottom */}
        <div className="flex justify-center items-center pb-8">
          <p className="text-sm text-gray-300 text-center">
            Tap or swipe the card to get a new prompt
          </p>
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
    </div>
  );
};

export default SparkApp;
