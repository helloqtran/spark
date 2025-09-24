import React from 'react';
import { ChevronRight } from 'lucide-react';

const WelcomePage = ({ onGetStarted }) => {
  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md">
        <h1 className="text-8xl font-bold mb-16 text-white tracking-wide spark-font">SPARK</h1>
        <p className="text-gray-300 mb-8">
          Get inspired with movement prompts designed to spark creativity in your freestyle practice.
        </p>
        <button 
          onClick={onGetStarted}
          className="text-black px-10 py-4 rounded-lg font-medium flex items-center gap-3 mx-auto transition-colors text-lg"
          style={{ backgroundColor: '#D8A159' }}
        >
          Get Started
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default WelcomePage;
