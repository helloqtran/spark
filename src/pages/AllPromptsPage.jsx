import React, { useState, useCallback } from 'react';
import { Heart, EyeOff, ListPlus, Info, X } from 'lucide-react';
import NavigationBar from '../components/NavigationBar';
import DropdownChip from '../components/DropdownChip';
import AddToListModal from '../components/AddToListModal';
import { PROMPTS_DATABASE, normalizePromptItem, getAllTags, getAllTypes } from '../data/prompts';

const AllPromptsPage = ({ 
  favorites, 
  hiddenPrompts, 
  lists, 
  toggleFavorite, 
  handleToggleHidden,
  addPromptToList,
  setLists,
  deleteList
}) => {
  // Filters (multi-select) - All Prompts view
  const [allPromptsFilterTypes, setAllPromptsFilterTypes] = useState(new Set());
  const [allPromptsFilterTags, setAllPromptsFilterTags] = useState(new Set());
  const [allPromptsFilterLists, setAllPromptsFilterLists] = useState(new Set());
  
  // Exclusion filters
  const [allPromptsExcludeTypes, setAllPromptsExcludeTypes] = useState(new Set());
  const [allPromptsExcludeTags, setAllPromptsExcludeTags] = useState(new Set());
  const [allPromptsExcludeLists, setAllPromptsExcludeLists] = useState(new Set());
  const [allPromptsOpenDropdown, setAllPromptsOpenDropdown] = useState(null);
  const [isAddToListOpen, setIsAddToListOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedListName, setSelectedListName] = useState('');
  const [currentPromptText, setCurrentPromptText] = useState(null);
  const [expandedPrompt, setExpandedPrompt] = useState(null);

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

  // Apply type filters (inclusion)
  const typeSelected = allPromptsFilterTypes.size > 0;
  if (typeSelected) {
    allPrompts = allPrompts.filter(p => p.type && allPromptsFilterTypes.has(p.type));
  }

  // Apply type exclusions
  const typeExcluded = allPromptsExcludeTypes.size > 0;
  if (typeExcluded) {
    allPrompts = allPrompts.filter(p => !p.type || !allPromptsExcludeTypes.has(p.type));
  }

  // Apply tag filters (inclusion)
  const tagSelected = allPromptsFilterTags.size > 0;
  if (tagSelected) {
    allPrompts = allPrompts.filter(p => p.tags && p.tags.some(tag => allPromptsFilterTags.has(tag)));
  }

  // Apply tag exclusions
  const tagExcluded = allPromptsExcludeTags.size > 0;
  if (tagExcluded) {
    allPrompts = allPrompts.filter(p => !p.tags || !p.tags.some(tag => allPromptsExcludeTags.has(tag)));
  }

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
    const promptText = currentPromptText;
    if (!targetName || !promptText) return;
    addPromptToList(targetName, promptText);
    setIsAddToListOpen(false);
    setCurrentPromptText(null);
  }, [selectedListName, currentPromptText, addPromptToList]);

  const togglePromptExpansion = useCallback((promptText) => {
    setExpandedPrompt(prev => {
      // If clicking on the same prompt, toggle it (collapse)
      if (prev === promptText) {
        return null;
      }
      // Otherwise, expand the new prompt (this will collapse the previous one)
      return promptText;
    });
  }, []);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col" style={{ background: 'transparent', width: '100vw !important', height: '100vh !important', minHeight: '100vh !important', margin: '0 !important', position: 'fixed !important', top: '0', bottom: '0', left: '0', right: '0' }}>
      <NavigationBar 
        favorites={favorites}
        hiddenPrompts={hiddenPrompts}
        lists={lists}
      />

      {/* Page Title */}
      <div className="bg-black py-8 relative z-40 pt-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-white text-center">All Prompts</h1>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex justify-center items-center pt-4 pb-4 px-4 sm:px-0 bg-black">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-3">
            <h2 className="text-sm sm:text-xs font-medium text-gray-300 uppercase tracking-wide">Filters</h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <DropdownChip
              label="Type"
              options={getAllTypes()}
              selected={allPromptsFilterTypes}
              excluded={allPromptsExcludeTypes}
              onToggle={(id, action) => {
                if (action === 'include') {
                  setAllPromptsFilterTypes(prev => new Set([...prev, id]));
                  setAllPromptsExcludeTypes(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                  });
                } else if (action === 'exclude') {
                  setAllPromptsFilterTypes(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                  });
                  setAllPromptsExcludeTypes(prev => new Set([...prev, id]));
                } else if (action === 'clear') {
                  setAllPromptsFilterTypes(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                  });
                  setAllPromptsExcludeTypes(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                  });
                }
              }}
              onClear={() => { setAllPromptsFilterTypes(new Set()); setAllPromptsExcludeTypes(new Set()); }}
              onOpenChange={(open) => setAllPromptsOpenDropdown(open ? 'type' : null)}
              isOpen={allPromptsOpenDropdown === 'type'}
              dropdownId="type"
            />
            <DropdownChip
              label="Tags"
              options={getAllTags().map(tag => ({ id: tag, label: tag }))}
              selected={allPromptsFilterTags}
              excluded={allPromptsExcludeTags}
              onToggle={(id, action) => {
                if (action === 'include') {
                  setAllPromptsFilterTags(prev => new Set([...prev, id]));
                  setAllPromptsExcludeTags(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                  });
                } else if (action === 'exclude') {
                  setAllPromptsFilterTags(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                  });
                  setAllPromptsExcludeTags(prev => new Set([...prev, id]));
                } else if (action === 'clear') {
                  setAllPromptsFilterTags(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                  });
                  setAllPromptsExcludeTags(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                  });
                }
              }}
              onClear={() => { setAllPromptsFilterTags(new Set()); setAllPromptsExcludeTags(new Set()); }}
              onOpenChange={(open) => setAllPromptsOpenDropdown(open ? 'tags' : null)}
              isOpen={allPromptsOpenDropdown === 'tags'}
              dropdownId="tags"
            />
            <DropdownChip
              label="Custom Lists"
              options={Object.keys(lists).map(n => ({ id: n, label: n }))}
              selected={allPromptsFilterLists}
              excluded={allPromptsExcludeLists}
              onToggle={(id, action) => {
                if (action === 'include') {
                  setAllPromptsFilterLists(prev => new Set([...prev, id]));
                  setAllPromptsExcludeLists(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                  });
                } else if (action === 'exclude') {
                  setAllPromptsFilterLists(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                  });
                  setAllPromptsExcludeLists(prev => new Set([...prev, id]));
                } else if (action === 'clear') {
                  setAllPromptsFilterLists(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                  });
                  setAllPromptsExcludeLists(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                  });
                }
              }}
              onClear={() => { setAllPromptsFilterLists(new Set()); setAllPromptsExcludeLists(new Set()); }}
              onOpenChange={(open) => setAllPromptsOpenDropdown(open ? 'lists' : null)}
              isOpen={allPromptsOpenDropdown === 'lists'}
              dropdownId="lists"
            />
            {(allPromptsFilterTypes.size > 0 || allPromptsFilterTags.size > 0 || allPromptsFilterLists.size > 0 || allPromptsExcludeTypes.size > 0 || allPromptsExcludeTags.size > 0 || allPromptsExcludeLists.size > 0) && (
              <button
                onClick={() => {
                  setAllPromptsFilterTypes(new Set());
                  setAllPromptsFilterTags(new Set());
                  setAllPromptsFilterLists(new Set());
                  setAllPromptsExcludeTypes(new Set());
                  setAllPromptsExcludeTags(new Set());
                  setAllPromptsExcludeLists(new Set());
                }}
                className="text-sm px-3 py-2 rounded-full border border-red-400 text-red-400 hover:text-red-300 hover:bg-red-900/20 hover:border-red-300 transition-colors flex items-center gap-1.5"
                aria-label="Clear all filters"
              >
                <X size={16} />
                Clear
              </button>
            )}
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
            const isExpanded = expandedPrompt === prompt.text;
            return (
              <div key={prompt.text} className={`${index !== allPrompts.length - 1 ? 'border-b border-white/10' : ''} ${isHidden ? 'opacity-50' : ''}`}>
                {/* Prompt row */}
                <div className="pl-6 pr-4 py-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0 pr-2">
                      <p className={`text-base leading-relaxed break-words ${isHidden ? 'text-gray-400' : 'text-white'}`}>{prompt.text}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {/* Info indicator */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePromptExpansion(prompt.text);
                        }}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        title="Show details"
                      >
                        <Info 
                          size={16} 
                          className="text-gray-400" 
                        />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(prompt.text);
                        }}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        title="Toggle favorite"
                      >
                        <Heart size={18} className={favorites.has(prompt.text) ? "fill-pink-500 text-pink-500" : "text-gray-400"} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleHidden(prompt.text);
                        }}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        title={isHidden ? "Show card" : "Hide card"}
                      >
                        <EyeOff size={18} className={isHidden ? "text-red-400" : "text-gray-400"} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedListName('');
                          setNewListName('');
                          setCurrentPromptText(prompt.text);
                          setIsAddToListOpen(true);
                        }}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        title="Add to list"
                      >
                        <ListPlus size={18} className="text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Expandable type and tags section */}
                {isExpanded && (prompt.type || (prompt.tags && prompt.tags.length > 0)) && (
                  <div className="pl-6 pr-4 pb-4 bg-white/2">
                    <div className="space-y-2">
                      {prompt.type && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 font-medium">type:</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${isHidden ? 'bg-gray-600 text-gray-300' : ''}`} style={!isHidden ? { backgroundColor: '#D8A159', color: 'black' } : {}}>
                            {prompt.type}
                          </span>
                        </div>
                      )}
                      {prompt.tags && prompt.tags.length > 0 && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-gray-400 font-medium mt-1">tags:</span>
                          <div className="flex items-center gap-2 flex-wrap">
                            {prompt.tags.map((tag, tagIndex) => (
                              <span key={tagIndex} className={`px-2 py-1 text-xs rounded-full ${isHidden ? 'bg-gray-600/50 text-gray-400' : 'bg-white/20 text-gray-300'}`}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
        currentPrompt={currentPromptText ? { text: currentPromptText } : null}
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

export default AllPromptsPage;
