import React, { useState, useEffect, useRef } from 'react';
import { Heart, EyeOff, ChevronDown, List } from 'lucide-react';

/**
 * Navigation Bar Component
 * 
 * Provides consistent navigation across all screens with counts for
 * favorites and hidden prompts.
 */
const NavigationBar = React.memo(({ currentScreen, setCurrentScreen, favorites, hiddenPrompts }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-black shadow-sm p-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
      <button
        onClick={() => setCurrentScreen('prompts')}
        className="text-xl font-bold text-white hover:text-gray-300 transition-colors spark-font"
        aria-label="Go to main prompts screen"
      >
        SPARK
      </button>
      <div className="flex items-center gap-2">
        {/* Collections Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-gray-300 text-base hover:text-white flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors"
            aria-label="View collections"
          >
            <List size={20} />
            Collections
            <ChevronDown size={18} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-40 bg-black border border-gray-700 rounded-lg shadow-xl py-2 z-50" style={{ right: '0', transform: 'translateX(-20px)' }}>
              <button
                onClick={() => {
                  setCurrentScreen('favorites');
                  setIsDropdownOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800 flex items-center gap-2 text-sm"
                aria-label={`View my favorites (${favorites.size} items)`}
              >
                <Heart size={18} className={favorites.size > 0 ? "fill-pink-500 text-pink-500" : ""} />
                My Favorites ({favorites.size})
              </button>
              <button
                onClick={() => {
                  setCurrentScreen('hidden');
                  setIsDropdownOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800 flex items-center gap-2 text-sm"
                aria-label={`View hidden prompts (${hiddenPrompts.size} items)`}
              >
                <EyeOff size={18} />
                Hidden ({hiddenPrompts.size})
              </button>
              <button
                onClick={() => {
                  setCurrentScreen('lists');
                  setIsDropdownOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800 flex items-center gap-2 text-sm"
                aria-label="View custom lists"
              >
                <List size={18} />
                Custom Lists
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => setCurrentScreen('all-prompts')}
          className="text-gray-300 text-base hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors"
          aria-label="View all prompts"
        >
          View All
        </button>
        <button
          onClick={() => setCurrentScreen('about')}
          className="text-gray-300 text-base hover:text-white px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors"
          aria-label="View about page"
        >
          About
        </button>
      </div>
    </div>
  );
});

NavigationBar.displayName = 'NavigationBar';

export default NavigationBar;
