import React from 'react';
import { Heart } from 'lucide-react';
import NavigationBar from '../components/NavigationBar';
import { useUserDataContext } from '../contexts/UserDataContext';

const FavoritesPage = () => {
  const { favorites, toggleFavorite } = useUserDataContext();
  const favoritePrompts = Array.from(favorites).map(text => {
    return { text };
  });

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col" style={{ background: 'transparent', width: '100vw !important', height: '100vh !important', minHeight: '100vh !important', margin: '0 !important', position: 'fixed !important', top: '0', bottom: '0', left: '0', right: '0' }}>
      <NavigationBar />

      {/* Page Title */}
      <div className="bg-transparent py-8 relative z-40 pt-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-white text-center">Favorite Prompts</h1>
        </div>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        <div className="p-6 max-w-4xl mx-auto w-full pb-8">
          {favoritePrompts.length === 0 ? (
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
              <div className="text-center p-8">
                <Heart size={64} className="mx-auto mb-4" style={{ color: '#D8A159' }} />
                <h3 className="text-xl font-semibold text-white mb-2">No favorites yet</h3>
                <p className="text-gray-300 mb-6">
                  Tap the heart icon on cards to add them here
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10">
              {favoritePrompts.map((prompt, index) => (
                <div key={prompt.text} className={`px-6 py-4 hover:bg-white/5 transition-colors ${index !== favoritePrompts.length - 1 ? 'border-b border-white/10' : ''}`}>
                  <div className="flex items-center justify-between gap-4">
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
