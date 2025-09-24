import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Import page components
import WelcomePage from './pages/WelcomePage';
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
      e.preventDefault();
    };

    const preventScroll = (e) => {
      // Allow scrolling only within specific containers
      const scrollableContainers = e.target.closest('.overflow-y-auto, .custom-scrollbar');
      if (!scrollableContainers) {
        e.preventDefault();
      }
    };

    // Prevent various touch events that can cause scrolling
    document.addEventListener('touchstart', preventDefault, { passive: false });
    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('touchend', preventDefault, { passive: false });
    
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
      document.removeEventListener('touchstart', preventDefault);
      document.removeEventListener('touchmove', preventScroll);
      document.removeEventListener('touchend', preventDefault);
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
        element={<WelcomePage onGetStarted={() => navigate('/prompts')} />} 
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
            toggleFavorite={toggleFavorite}
          />
        } 
      />
      <Route 
        path="/hidden" 
        element={
          <HiddenPage 
            hiddenPrompts={hiddenPrompts}
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
        path="/all-prompts" 
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