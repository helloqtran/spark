import React, { useState, useCallback } from 'react';
import { Heart, EyeOff, Plus } from 'lucide-react';
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
  const [allPromptsOpenDropdown, setAllPromptsOpenDropdown] = useState(null);
  const [isAddToListOpen, setIsAddToListOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedListName, setSelectedListName] = useState('');
  const [currentPromptText, setCurrentPromptText] = useState(null);

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

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col" style={{ background: 'radial-gradient(ellipse at bottom right, #D8A159 0%, #D8A159 10%, #B88A4A 20%, #8A6B2F 30%, #4A3A1A 40%, #000000 50%)', width: '100vw !important', height: '100dvh !important', minHeight: '100vh !important', margin: '0 !important', position: 'fixed !important', top: 'calc(-1 * env(safe-area-inset-top))', bottom: 'calc(-1 * env(safe-area-inset-bottom))', left: 'calc(-1 * env(safe-area-inset-left))', right: 'calc(-1 * env(safe-area-inset-right))' }}>
      <NavigationBar 
        favorites={favorites}
        hiddenPrompts={hiddenPrompts}
        lists={lists}
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
            <h2 className="text-sm sm:text-xs font-medium text-gray-300 uppercase tracking-wide">Filters</h2>
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
              className="text-sm sm:text-xs px-2 py-1 rounded-full text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 transition-colors"
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
