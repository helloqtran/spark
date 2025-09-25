import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Import page components
import MainPromptsPage from './pages/MainPromptsPage';
import FavoritesPage from './pages/FavoritesPage';
import HiddenPage from './pages/HiddenPage';
import AboutPage from './pages/AboutPage';
import AllPromptsPage from './pages/AllPromptsPage';
import ListsPage from './pages/ListsPage';

const App = () => {
  const navigate = useNavigate();
  
  // Simple state without complex data loading
  const [favorites, setFavorites] = React.useState(new Set());
  const [hiddenPrompts, setHiddenPrompts] = React.useState(new Set());
  const [lists, setLists] = React.useState({});

  // Simple functions
  const toggleFavorite = (promptText) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(promptText)) {
        newFavorites.delete(promptText);
      } else {
        newFavorites.add(promptText);
      }
      return newFavorites;
    });
  };

  const toggleHidden = (promptText) => {
    setHiddenPrompts(prev => {
      const newHidden = new Set(prev);
      if (newHidden.has(promptText)) {
        newHidden.delete(promptText);
      } else {
        newHidden.add(promptText);
      }
      return newHidden;
    });
  };

  const addPromptToList = (listName, promptText) => {
    if (!listName || !promptText) return;
    setLists(prev => {
      const current = prev[listName] || [];
      const nextItems = current.includes(promptText) ? current : [...current, promptText];
      return { ...prev, [listName]: nextItems };
    });
  };

  const removePromptFromList = (listName, promptText) => {
    setLists(prev => {
      const current = prev[listName] || [];
      const nextItems = current.filter(t => t !== promptText);
      return { ...prev, [listName]: nextItems };
    });
  };

  const deleteList = (listName) => {
    setLists(prev => {
      const next = { ...prev };
      delete next[listName];
      return next;
    });
  };

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

  // Enhanced toggleHidden function
  const handleToggleHidden = (promptText) => {
    toggleHidden(promptText);
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <MainPromptsPage 
            favorites={favorites}
            hiddenPrompts={hiddenPrompts}
            lists={lists}
            toggleFavorite={toggleFavorite}
            toggleHidden={toggleHidden}
            addPromptToList={addPromptToList}
            setLists={setLists}
            handleToggleHidden={toggleHidden}
          />
        } 
      />
      <Route 
        path="/prompts" 
        element={
          <MainPromptsPage 
            favorites={favorites}
            hiddenPrompts={hiddenPrompts}
            lists={lists}
            toggleFavorite={toggleFavorite}
            toggleHidden={toggleHidden}
            addPromptToList={addPromptToList}
            setLists={setLists}
            handleToggleHidden={toggleHidden}
          />
        } 
      />
      <Route 
        path="/favorites" 
        element={
          <FavoritesPage 
            favorites={favorites}
            hiddenPrompts={hiddenPrompts}
            lists={lists}
            toggleFavorite={toggleFavorite}
          />
        } 
      />
      <Route 
        path="/hidden" 
        element={
          <HiddenPage 
            favorites={favorites}
            hiddenPrompts={hiddenPrompts}
            lists={lists}
            handleToggleHidden={toggleHidden}
          />
        } 
      />
      <Route 
        path="/about" 
        element={
          <AboutPage 
            favorites={favorites}
            hiddenPrompts={hiddenPrompts}
          />
        } 
      />
      <Route 
        path="/all-cards" 
        element={
          <AllPromptsPage 
            favorites={favorites}
            hiddenPrompts={hiddenPrompts}
            lists={lists}
            toggleFavorite={toggleFavorite}
            handleToggleHidden={toggleHidden}
            addPromptToList={addPromptToList}
            setLists={setLists}
            deleteList={deleteList}
          />
        } 
      />
      <Route 
        path="/lists" 
        element={
          <ListsPage 
            favorites={favorites}
            hiddenPrompts={hiddenPrompts}
            lists={lists}
            addPromptToList={addPromptToList}
            setLists={setLists}
            removePromptFromList={removePromptFromList}
            deleteList={deleteList}
          />
        } 
      />
      {/* Redirect any unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;