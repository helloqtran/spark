import React from 'react';
import { Heart } from 'lucide-react';
import NavigationBar from '../components/NavigationBar';

const FavoritesPage = ({ favorites, hiddenPrompts, toggleFavorite }) => {
  const favoritePrompts = Array.from(favorites).map(text => {
    return { text };
  });

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col" style={{ background: 'radial-gradient(ellipse at bottom right, #D8A159 0%, #D8A159 10%, #B88A4A 20%, #8A6B2F 30%, #4A3A1A 40%, #000000 50%)', width: '100vw !important', height: '100dvh !important', minHeight: '100vh !important', margin: '0 !important', position: 'fixed !important', top: 'calc(-1 * env(safe-area-inset-top))', bottom: 'calc(-1 * env(safe-area-inset-bottom))', left: 'calc(-1 * env(safe-area-inset-left))', right: 'calc(-1 * env(safe-area-inset-right))' }}>
      <NavigationBar 
        favorites={favorites}
        hiddenPrompts={hiddenPrompts}
        lists={lists}
      />

      {/* Page Title */}
      <div className="bg-black py-8 relative z-40 pt-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-white text-center">My Favorites</h1>
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="p-6 max-w-4xl mx-auto w-full pb-8">
          {favoritePrompts.length === 0 ? (
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
              <div className="text-center py-12">
                <Heart size={48} className="mx-auto text-gray-500 mb-4" />
                <p className="text-gray-300">No favorites yet</p>
                <p className="text-sm text-gray-400 mt-2">Tap the heart icon on prompts to add them here</p>
              </div>
            </div>
          ) : (
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10">
              {favoritePrompts.map((prompt, index) => (
                <div key={prompt.text} className={`px-6 py-4 hover:bg-white/5 transition-colors ${index !== favoritePrompts.length - 1 ? 'border-b border-white/10' : ''}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-white text-sm leading-relaxed break-words">{prompt.text}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0 self-center">
                      <button
                        onClick={() => toggleFavorite(prompt.text)}
                        className="p-3 hover:bg-white/10 rounded-full transition-colors"
                        title="Remove from favorites"
                      >
                        <Heart size={20} className="fill-pink-500 text-pink-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;
