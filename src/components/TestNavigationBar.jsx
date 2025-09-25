import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Heart, EyeOff, ChevronDown, List, Menu, X } from 'lucide-react';

/**
 * Test Navigation Bar Component (without SPARK logo)
 * 
 * Provides consistent navigation across all screens with counts for
 * favorites and hidden prompts, but without the SPARK logo.
 */
const TestNavigationBar = React.memo(({ favorites, hiddenPrompts, lists }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdown and mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      {/* Main Navbar - Always visible */}
      <div className="bg-transparent shadow-sm px-6 py-4 flex items-center justify-end fixed top-0 left-0 right-0 z-50" style={{ paddingTop: 'max(env(safe-area-inset-top), 1rem)', paddingLeft: 'max(env(safe-area-inset-left), 1.5rem)', paddingRight: 'max(env(safe-area-inset-right), 1.5rem)' }}>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {/* Collections Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-gray-300 text-sm sm:text-xs hover:text-white flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors"
              aria-label="View collections"
            >
              <List size={16} className="sm:w-5 sm:h-5" />
              Collections
              <ChevronDown size={14} className={`sm:w-[18px] sm:h-[18px] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-36 sm:w-40 bg-black border border-gray-700 rounded-lg shadow-xl py-2 z-50" style={{ right: '0', transform: 'translateX(-5px)' }}>
                <button
                  onClick={() => {
                    navigate('/favorites');
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800 flex items-center gap-2 text-sm whitespace-nowrap"
                  aria-label={`View favorite prompts (${favorites.size} items)`}
                >
                  <Heart size={18} className={favorites.size > 0 ? "fill-pink-500 text-pink-500" : ""} />
                  Favorites ({favorites.size})
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
            className="text-gray-300 text-sm sm:text-xs hover:text-white px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors"
            aria-label="View all prompts"
          >
            View All
          </button>
          <button
            onClick={() => navigate('/about')}
            className="text-gray-300 text-sm sm:text-xs hover:text-white px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors"
            aria-label="View about page"
          >
            About
          </button>
        </div>
        
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div className={`md:hidden fixed top-0 right-0 bottom-0 bg-black border-l border-gray-800 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ width: '280px', paddingTop: 'max(env(safe-area-inset-top), 0px)', paddingBottom: 'max(env(safe-area-inset-bottom), 0px)', zIndex: 45 }}>
        <div ref={mobileMenuRef} className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-end px-6 py-4 border-b border-gray-800">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
              aria-label="Close mobile menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 px-6 py-4 space-y-2 overflow-y-auto custom-scrollbar">
            {/* Collections Section */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide">Collections</h3>
              <button
                onClick={() => {
                  navigate('/favorites');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                aria-label={`View my favorites (${favorites.size} items)`}
              >
                <Heart size={20} className={favorites.size > 0 ? "fill-pink-500 text-pink-500" : ""} />
                <div>
                  <div className="font-medium">Favorites</div>
                  <div className="text-sm text-gray-400">{favorites.size} items</div>
                </div>
              </button>
              <button
                onClick={() => {
                  navigate('/hidden');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                aria-label={`View hidden prompts (${hiddenPrompts.size} items)`}
              >
                <EyeOff size={20} />
                <div>
                  <div className="font-medium">Hidden</div>
                  <div className="text-sm text-gray-400">{hiddenPrompts.size} items</div>
                </div>
              </button>
              <button
                onClick={() => {
                  navigate('/lists');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                aria-label="View custom lists"
              >
                <List size={20} />
                <div>
                  <div className="font-medium">Custom Lists</div>
                  <div className="text-sm text-gray-400">{Object.keys(lists || {}).length} lists</div>
                </div>
              </button>
            </div>

            {/* Other Pages */}
            <div className="space-y-2 pt-4 border-t border-gray-800">
              <button
                onClick={() => {
                  navigate('/all-prompts');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                aria-label="View all prompts"
              >
                <div className="font-medium">View All Prompts</div>
              </button>
              <button
                onClick={() => {
                  navigate('/about');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-left text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                aria-label="View about page"
              >
                <div className="font-medium">About</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed top-0 left-0 right-0 bottom-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
          style={{ paddingTop: 'max(env(safe-area-inset-top), 0px)', paddingBottom: 'max(env(safe-area-inset-bottom), 0px)' }}
        />
      )}
    </>
  );
});

TestNavigationBar.displayName = 'TestNavigationBar';

export default TestNavigationBar;
