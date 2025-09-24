import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, EyeOff, ChevronDown, List } from 'lucide-react';

/**
 * Navigation Bar Component
 * 
 * Provides consistent navigation across all screens with counts for
 * favorites and hidden prompts.
 */
const NavigationBar = React.memo(({ favorites, hiddenPrompts }) => {
  const navigate = useNavigate();
  const location = useLocation();
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
    <div className="bg-black shadow-sm px-6 py-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50" style={{ paddingTop: 'max(env(safe-area-inset-top), 0px)', paddingLeft: 'max(env(safe-area-inset-left), 1.5rem)', paddingRight: 'max(env(safe-area-inset-right), 1.5rem)' }}>
      <button
        onClick={() => navigate('/prompts')}
        className="text-lg sm:text-xl font-bold text-white hover:text-gray-300 transition-colors spark-font"
        aria-label="Go to main prompts screen"
      >
        SPARK
      </button>
      <div className="flex items-center gap-2">
        {/* Collections Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="text-gray-300 text-sm sm:text-base hover:text-white flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors"
            aria-label="View collections"
          >
            <List size={16} className="sm:w-5 sm:h-5" />
            Collections
            <ChevronDown size={14} className={`sm:w-[18px] sm:h-[18px] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-48 sm:w-52 bg-black border border-gray-700 rounded-lg shadow-xl py-2 z-50" style={{ right: '0', transform: 'translateX(-5px)' }}>
              <button
                onClick={() => {
                  navigate('/favorites');
                  setIsDropdownOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800 flex items-center gap-2 text-sm whitespace-nowrap"
                aria-label={`View my favorites (${favorites.size} items)`}
              >
                <Heart size={18} className={favorites.size > 0 ? "fill-pink-500 text-pink-500" : ""} />
                My Favorites ({favorites.size})
              </button>
              <button
                onClick={() => {
                  navigate('/hidden');
                  setIsDropdownOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800 flex items-center gap-2 text-sm whitespace-nowrap"
                aria-label={`View hidden prompts (${hiddenPrompts.size} items)`}
              >
                <EyeOff size={18} />
                Hidden ({hiddenPrompts.size})
              </button>
              <button
                onClick={() => {
                  navigate('/lists');
                  setIsDropdownOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800 flex items-center gap-2 text-sm whitespace-nowrap"
                aria-label="View custom lists"
              >
                <List size={18} />
                Custom Lists
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate('/all-prompts')}
          className="text-gray-300 text-sm sm:text-base hover:text-white px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors"
          aria-label="View all prompts"
        >
          View All
        </button>
        <button
          onClick={() => navigate('/about')}
          className="text-gray-300 text-sm sm:text-base hover:text-white px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors"
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
