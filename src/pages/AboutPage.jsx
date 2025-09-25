import React from 'react';
import { Heart } from 'lucide-react';
import NavigationBar from '../components/NavigationBar';

const AboutPage = ({ favorites, hiddenPrompts }) => {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col" style={{ background: 'transparent', width: '100vw !important', height: '100vh !important', minHeight: '100vh !important', margin: '0 !important', position: 'fixed !important', top: '0', bottom: '0', left: '0', right: '0' }}>
      <NavigationBar 
        favorites={favorites}
        hiddenPrompts={hiddenPrompts}
        lists={{}}
      />

      {/* Page Title */}
      <div className="bg-transparent py-8 relative z-40 pt-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-white text-center">About Spark</h1>
        </div>
      </div>

      {/* About Content */}
      <div className="flex-1 p-6 max-w-2xl mx-auto w-full relative z-10">
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <div className="space-y-4">
            <p className="text-white leading-relaxed">
              Spark was vibecoded with lots of love (and nearly a few tears) by <a href="https://www.instagram.com/pole_teenie" target="_blank" rel="noopener noreferrer" className="underline transition-colors font-medium" style={{ color: '#D8A159' }} onMouseEnter={(e) => e.target.style.color = '#B88A4A'} onMouseLeave={(e) => e.target.style.color = '#D8A159'}>@pole_teenie</a> and <a href="https://cursor.com" target="_blank" rel="noopener noreferrer" className="underline transition-colors font-medium" style={{ color: '#D8A159' }} onMouseEnter={(e) => e.target.style.color = '#B88A4A'} onMouseLeave={(e) => e.target.style.color = '#D8A159'}>Cursor</a> <Heart size={16} className="inline fill-pink-500 text-pink-500 ml-1" />
            </p>
            
            <p className="text-white leading-relaxed">
              DM <a href="https://www.instagram.com/sparkcards.dance" target="_blank" rel="noopener noreferrer" className="underline transition-colors font-medium" style={{ color: '#D8A159' }} onMouseEnter={(e) => e.target.style.color = '#B88A4A'} onMouseLeave={(e) => e.target.style.color = '#D8A159'}>@sparkcards.dance</a> on Instagram to share your favorite prompts or to let me know how I can make Spark even better!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
