import React, { useState, useCallback } from 'react';
import NavigationBar from '../components/NavigationBar';
import FiltersSection from '../components/filters/FiltersSection';
import PromptDeck from '../components/prompts/PromptDeck';
import AddToListModal from '../components/AddToListModal';
import { useUserDataContext } from '../contexts/UserDataContext';
import { usePromptFilters } from '../hooks/usePromptFilters';
import { usePromptNavigation } from '../hooks/usePromptNavigation';

const MainPromptsPage = () => {
  const { favorites, lists, toggleFavorite, addPromptToList, setLists } = useUserDataContext();
  
  // Modal state
  const [isAddToListOpen, setIsAddToListOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedListName, setSelectedListName] = useState('');
  
  // Use custom hooks for filters and navigation
  const filters = usePromptFilters(lists, new Set());
  const navigation = usePromptNavigation(filters.availablePrompts);


  // Callback functions for modal handling

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
    const promptText = navigation.currentPromptText || (navigation.currentPrompt && navigation.currentPrompt.text);
    if (!targetName || !promptText) return;
    addPromptToList(targetName, promptText);
    setIsAddToListOpen(false);
    navigation.setCurrentPromptText(null);
  }, [selectedListName, navigation.currentPromptText, navigation.currentPrompt, addPromptToList, navigation.setCurrentPromptText]);

  return (
    <div 
      className="fixed inset-0 flex flex-col bg-transparent z-[1]" 
      style={{ 
        width: '100vw', 
        height: '100vh',
        paddingTop: 'max(env(safe-area-inset-top), 0px)',
        paddingBottom: 'max(env(safe-area-inset-bottom), 0px)'
      }}
    >
      <NavigationBar />

      {/* Main Content Area - Takes remaining space and centers content */}
      <div className="flex-1 flex flex-col justify-center items-center px-4" style={{ minHeight: 0 }}>
        {/* Combined Filters and Cards Section */}
        <div className="flex flex-col items-center w-full max-w-4xl">
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
          />

          {/* Card and Help Text Container */}
          <div className="flex flex-col items-center w-full">
            {/* Card Deck */}
            <div className="flex items-center justify-center w-full mb-6 sm:mb-8">
              <PromptDeck
                availablePrompts={filters.availablePrompts}
                currentIndex={navigation.currentIndex}
                currentPrompt={navigation.currentPrompt}
                isAnimating={navigation.isAnimating}
                onNextPrompt={navigation.getNewPrompt}
                onToggleFavorite={toggleFavorite}
                onAddToList={handleAddToList}
                favorites={favorites}
              />
            </div>

            {/* Help Text */}
            {filters.availablePrompts.length > 0 && (
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
          navigation.setCurrentPromptText(null);
        }}
        currentPrompt={navigation.currentPromptText ? { text: navigation.currentPromptText } : navigation.currentPrompt}
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

export default MainPromptsPage;
