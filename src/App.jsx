import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import page components
import MainPromptsPage from './pages/MainPromptsPage';
import FavoritesPage from './pages/FavoritesPage';
import HiddenPage from './pages/HiddenPage';
import AboutPage from './pages/AboutPage';
import AllPromptsPage from './pages/AllPromptsPage';
import ListsPage from './pages/ListsPage';
import TestWelcomePage from './pages/TestWelcomePage';

// Import context provider
import { UserDataProvider } from './contexts/UserDataContext';

const App = () => {

  // Prevent mobile scrolling
  useEffect(() => {
    const preventDefault = (e) => {
      // Allow touch events on interactive elements
      if (e.target.closest('button, input, select, textarea, [role="button"], [tabindex]')) {
        return;
      }
      // Don't prevent default for scrollable containers
      const scrollableContainers = e.target.closest('.overflow-y-auto, .custom-scrollbar, [class*="overflow-y-auto"], [class*="custom-scrollbar"]');
      if (scrollableContainers) {
        return;
      }
      e.preventDefault();
    };

    const preventScroll = (e) => {
      // Allow scrolling only within specific containers
      const scrollableContainers = e.target.closest('.overflow-y-auto, .custom-scrollbar, [class*="overflow-y-auto"], [class*="custom-scrollbar"]');
      if (!scrollableContainers) {
        e.preventDefault();
      }
    };

    // Prevent various touch events that can cause scrolling
    // Only prevent on the document body, not on scrollable containers
    document.addEventListener('touchmove', preventScroll, { passive: false });
    
    // Prevent mouse wheel scrolling on desktop
    document.addEventListener('wheel', preventScroll, { passive: false });
    
    // Prevent keyboard scrolling
    document.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key)) {
        // Allow keyboard navigation only within specific containers
        const scrollableContainers = document.activeElement?.closest('.overflow-y-auto, .custom-scrollbar');
        if (!scrollableContainers) {
          e.preventDefault();
        }
      }
    });

    return () => {
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('wheel', preventScroll);
    };
  }, []);

  return (
    <UserDataProvider>
      <Routes>
        <Route path="/" element={<TestWelcomePage />} />
        <Route path="/shuffle" element={<MainPromptsPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/hidden" element={<HiddenPage />} />
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