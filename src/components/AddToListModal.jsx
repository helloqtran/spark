import React from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * AddToListModal Component
 * 
 * Modal for adding prompts to existing lists or creating new lists.
 * Handles both selection from existing lists and creation of new ones.
 */
const AddToListModal = React.memo(({ 
  isOpen, 
  onClose, 
  currentPrompt, 
  lists, 
  selectedListName, 
  setSelectedListName, 
  newListName, 
  setNewListName, 
  onAddToList, 
  onCreateList 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="relative bg-black border border-gray-700 rounded-2xl shadow-xl w-[90%] max-w-sm p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Add to list</h3>
        <div className="space-y-4">
          {/* Existing lists */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Choose a list</label>
            <div className="relative">
              <select
                value={selectedListName}
                onChange={(e) => setSelectedListName(e.target.value)}
                className="w-full border border-gray-600 rounded-lg px-3 py-2 pr-8 text-base focus:outline-none focus:ring-2 focus:ring-gray-500 bg-gray-800 text-white appearance-none"
                aria-label="Select existing list"
              >
                <option value="">Select…</option>
                {Object.keys(lists).map(name => {
                  const isAlreadyInList = currentPrompt && lists[name] && lists[name].includes(currentPrompt.text);
                  return (
                    <option 
                      key={name} 
                      value={name}
                      disabled={isAlreadyInList}
                      style={{ color: isAlreadyInList ? '#9CA3AF' : 'inherit' }}
                    >
                      {name}{isAlreadyInList ? ' (already in list)' : ''}
                    </option>
                  );
                })}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown size={20} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* New list */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Or create a new list</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="New list name"
                className="flex-1 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 bg-gray-800 text-white"
                style={{ fontSize: '16px' }}
                aria-label="New list name"
              />
              <button
                onClick={onCreateList}
                className={`px-4 py-3 text-base rounded-lg font-medium border-0 ${
                  newListName.trim() 
                    ? 'text-black' 
                    : 'bg-gray-600 text-gray-400'
                }`}
                style={newListName.trim() ? { backgroundColor: '#D8A159' } : { backgroundColor: '#4B5563' }}
                disabled={!newListName.trim()}
                aria-label="Create new list"
              >
                Create
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-3 text-base text-gray-300 hover:text-white rounded-lg hover:bg-gray-800/50 transition-colors"
            aria-label="Cancel adding to list"
          >
            Cancel
          </button>
          <button
            onClick={onAddToList}
            disabled={!selectedListName || (currentPrompt && selectedListName && lists[selectedListName] && lists[selectedListName].includes(currentPrompt.text))}
            className={`px-5 py-3 text-base rounded-lg font-medium ${
              (!selectedListName || (currentPrompt && selectedListName && lists[selectedListName] && lists[selectedListName].includes(currentPrompt.text))) 
                ? 'bg-gray-600 text-gray-400' 
                : 'text-black'
            }`}
            style={(!selectedListName || (currentPrompt && selectedListName && lists[selectedListName] && lists[selectedListName].includes(currentPrompt.text))) ? {} : { backgroundColor: '#D8A159' }}
            aria-label="Add prompt to selected list"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
});

AddToListModal.displayName = 'AddToListModal';

export default AddToListModal;
