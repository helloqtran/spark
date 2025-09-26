import React, { useState, useCallback } from 'react';
import { Heart, ListPlus, Info, X } from 'lucide-react';
import NavigationBar from '../components/NavigationBar';
import FiltersSection from '../components/filters/FiltersSection';
import AddToListModal from '../components/AddToListModal';
import { PROMPTS_DATABASE, normalizePromptItem, getAllTags, getAllTypes } from '../data/prompts';
import { useUserDataContext } from '../contexts/UserDataContext';
import { useAllPromptsFilters } from '../hooks/useAllPromptsFilters';

const AllPromptsPage = () => {
  const { favorites, lists, toggleFavorite, addPromptToList, setLists, deleteList } = useUserDataContext();
  
  // Use custom hook for filters
  const filters = useAllPromptsFilters();
  const [isAddToListOpen, setIsAddToListOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedListName, setSelectedListName] = useState('');
  const [currentPromptText, setCurrentPromptText] = useState(null);
  const [expandedPrompt, setExpandedPrompt] = useState(null);

  // Use filtered prompts from the hook
  const allPrompts = filters.availablePrompts;

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
      <NavigationBar />

      {/* Page Title */}
      <div className="bg-transparent py-8 relative z-40 pt-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-white text-center">All Prompts</h1>
        </div>
      </div>

      {/* Filters Section */}
      <FiltersSection
        filterTypes={filters.filterTypes}
        setFilterTypes={filters.setFilterTypes}
        excludeTypes={filters.excludeTypes}
        setExcludeTypes={filters.setExcludeTypes}
        filterTags={filters.filterTags}
        setFilterTags={filters.setFilterTags}
        excludeTags={filters.excludeTags}
        setExcludeTags={filters.setExcludeTags}
        filterLists={filters.filterLists}
        setFilterLists={filters.setFilterLists}
        excludeLists={filters.excludeLists}
        setExcludeLists={filters.setExcludeLists}
        lists={lists}
        openDropdown={filters.openDropdown}
        setOpenDropdown={filters.setOpenDropdown}
        onClearFilters={filters.clearAllFilters}
        showCustomListsFilter={false}
      />

      {/* Scrollable content area */}
      <div 
        className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#D8A159 #1f2937'
        }}
      >
        <div className="p-4 sm:p-6 max-w-4xl mx-auto w-full pb-8 pt-6">
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10">
          {allPrompts.map((prompt, index) => {
            const isExpanded = expandedPrompt === prompt.text;
            return (
              <div key={prompt.text} className={`${index !== allPrompts.length - 1 ? 'border-b border-white/10' : ''}`}>
                {/* Prompt row */}
                <div className="pl-6 pr-4 py-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-base leading-relaxed break-words text-white">{prompt.text}</p>
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
                
                {/* Expandable type, tags, and credit section */}
                {isExpanded && (prompt.type || (prompt.tags && prompt.tags.length > 0) || prompt.credit) && (
                  <div className="pl-6 pr-4 pb-4 bg-white/2">
                    <div className="space-y-2">
                      {prompt.type && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400 font-medium">type:</span>
                          <span className="px-2 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: '#D8A159', color: 'black' }}>
                            {prompt.type}
                          </span>
                        </div>
                      )}
                      {prompt.tags && prompt.tags.length > 0 && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs text-gray-400 font-medium mt-1">tags:</span>
                          <div className="flex items-center gap-2 flex-wrap">
                            {prompt.tags.map((tag, tagIndex) => (
                              <span key={tagIndex} className="px-2 py-1 text-xs rounded-full bg-white/20 text-gray-300">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {prompt.credit && (
                        <div className="flex items-center gap-2">
                          {prompt.creditUrl ? (
                            <a
                              href={prompt.creditUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs transition-colors"
                              style={{ color: '#D8A159' }}
                              onMouseEnter={(e) => e.target.style.color = '#B88A4A'}
                              onMouseLeave={(e) => e.target.style.color = '#D8A159'}
                              onClick={(e) => e.stopPropagation()}
                            >
                              {prompt.credit}
                            </a>
                          ) : (
                            <span 
                              className="text-xs"
                              style={{ color: '#D8A159' }}
                            >
                              {prompt.credit}
                            </span>
                          )}
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
