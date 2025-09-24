import React, { useState, useCallback } from 'react';
import NavigationBar from '../components/NavigationBar';
import AddToListModal from '../components/AddToListModal';

const ListsPage = ({ 
  favorites, 
  hiddenPrompts, 
  lists, 
  addPromptToList,
  setLists,
  removePromptFromList,
  deleteList
}) => {
  const [isAddToListOpen, setIsAddToListOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedListName, setSelectedListName] = useState('');
  const [currentPromptText, setCurrentPromptText] = useState(null);

  const listNames = Object.keys(lists);

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

export default ListsPage;
