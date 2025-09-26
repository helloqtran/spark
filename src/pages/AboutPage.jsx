import React from 'react';
import { Heart, Instagram } from 'lucide-react';
import NavigationBar from '../components/NavigationBar';

// Import package.json for version
import packageJson from '../../package.json';

const AboutPage = () => {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col" style={{ background: 'transparent', width: '100vw !important', height: '100vh !important', minHeight: '100vh !important', margin: '0 !important', position: 'fixed !important', top: '0', bottom: '0', left: '0', right: '0' }}>
      <NavigationBar />

      {/* Page Title */}
      <div className="bg-transparent py-8 relative z-40 pt-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-white text-center">About</h1>
        </div>
      </div>

      {/* About Content */}
      <div className="flex-1 p-6 max-w-2xl mx-auto w-full relative z-10">
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          <div className="space-y-4">
          <p className="text-white leading-relaxed text-center">
              Spark was vibecoded with lots of love by <a href="https://www.instagram.com/pole_teenie" target="_blank" rel="noopener noreferrer" className="underline transition-colors font-medium" style={{ color: '#D8A159' }} onMouseEnter={(e) => e.target.style.color = '#B88A4A'} onMouseLeave={(e) => e.target.style.color = '#D8A159'} onTouchStart={(e) => e.stopPropagation()}>@pole_teenie</a> using Cursor <Heart size={16} className="inline fill-pink-500 text-pink-500 ml-1" />
            </p>
            <br />
            <p className="text-white leading-relaxed text-center">
              DM @sparkcards.dance on Instagram to share your favorite prompts, request new features, or just to say hi!
            </p>
          
          </div>
        </div>
        
        {/* Instagram Icon Link */}
        <div className="flex justify-center mt-6">
          <a 
            href="https://www.instagram.com/sparkcards.dance" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-gray-300 transition-colors p-2"
            onTouchStart={(e) => e.stopPropagation()}
          >
            <Instagram size={32} />
          </a>
        </div>
      </div>

      {/* Version display in bottom right */}
      <div className="absolute bottom-4 right-4 text-xs text-gray-400/60 z-20">
        v{packageJson.version}
      </div>
    </div>
  );
};

export default AboutPage;
