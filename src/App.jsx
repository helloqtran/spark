import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import page components
import MainPromptsPage from './pages/MainPromptsPage';
import FavoritesPage from './pages/FavoritesPage';
import AboutPage from './pages/AboutPage';
import AllPromptsPage from './pages/AllPromptsPage';
import ListsPage from './pages/ListsPage';
import TestWelcomePage from './pages/TestWelcomePage';

// Import context provider
import { UserDataProvider } from './contexts/UserDataContext';

const App = () => {

  // Prevent scroll on the main page while allowing scrolls in dropdowns and lists
  useEffect(() => {
    const isScrollableElement = (element) => {
      // Check if the element or any of its parents is a scrollable container
      const scrollableSelectors = [
        '.overflow-y-auto',
        '.custom-scrollbar',
        '[class*="overflow-y-auto"]',
        '[class*="custom-scrollbar"]',
        '[class*="max-h-"]', // Dropdown-style scrolling
        'textarea',
        'select',
        '[role="listbox"]',
        '[data-scrollable="true"]'
      ];
      
      const container = element.closest(scrollableSelectors.join(', '));
      return !!container;
    };

    const isInteractiveElement = (element) => {
      // Check if the element or any parent is an interactive element
      const interactiveSelectors = [
        'button',
        'input',
        'textarea',
        'select',
        '[role="button"]',
        '[role="menu"]',
        '[role="listbox"]',
        '[role="combobox"]',
        '[tabindex]',
        '.dropdown-toggle',
        '.dropdown-menu'
      ];
      
      return !!element.closest(interactiveSelectors.join(', '));
    };

    const preventScroll = (e) => {
      // Don't prevent default behavior on scrollable containers or interactive elements
      if (isScrollableElement(e.target) || isInteractiveElement(e.target)) {
        return;
      }
      
      // Prevent scroll for everything else
      e.preventDefault();
    };

    const preventTouchScroll = (e) => {
      // Same logic for touch events
      if (isScrollableElement(e.target) || isInteractiveElement(e.target)) {
        return;
      }
      
      e.preventDefault();
    };

    const preventKeyboardScroll = (e) => {
      const scrollScrollableKeys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
      
      if (!scrollScrollableKeys.includes(e.key)) {
        return;
      }
      
      // Allow keyboard scrolling on interactive/scrollable elements
      const activeElement = document.activeElement;
      if (isScrollableElement(activeElement) || 
          isInteractiveElement(activeElement) ||
          activeElement?.tagName === 'INPUT' ||
          activeElement?.tagName === 'TEXTAREA' ||
          activeElement?.tagName === 'SELECT') {
        return;
      }
      
      e.preventDefault();
    };

    // Add preventDefault to document.touchMove to ensure passive: false behavior
    document.addEventListener('touchstart', preventTouchScroll, { passive: false });
    document.addEventListener('touchmove', preventTouchScroll, { passive: false });
    document.addEventListener('wheel', preventScroll, { passive: false });
    document.addEventListener('keydown', preventKeyboardScroll);
    
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('touchstart', preventTouchScroll);
      document.removeEventListener('touchmove', preventTouchScroll);
      document.removeEventListener('wheel', preventScroll);
      document.removeEventListener('keydown', preventKeyboardScroll);
      
      // Reset overflow settings
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <UserDataProvider>
      <Routes>
        <Route path="/" element={<TestWelcomePage />} />
        <Route path="/shuffle" element={<MainPromptsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/all-prompts" element={<AllPromptsPage />} />
        <Route path="/lists" element={<ListsPage />} />
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </UserDataProvider>
  );
};

export default App;