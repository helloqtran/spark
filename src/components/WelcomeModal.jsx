import React from 'react';
import { createPortal } from 'react-dom';
import { ChevronRight, X } from 'lucide-react';

const WelcomeModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 backdrop-blur-md z-50" 
        style={{ backgroundColor: 'transparent' }}
        onClick={onClose}
        aria-label="Close welcome modal"
      />
      
      {/* Modal Content */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black border border-gray-700 rounded-2xl shadow-xl w-[90%] max-w-md py-16 px-8 text-center z-50">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
          aria-label="Close welcome modal"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="max-w-sm mx-auto mb-6">
          <h1 className="text-7xl font-bold mt-8 mb-12 text-white tracking-wide noto-serif-jp">SPARK</h1>
          <p className="text-gray-300 mb-8 text-lg leading-relaxed">
            Get inspired with movement prompts designed to spark creativity in your freestyle practice.
          </p>
          <button 
            onClick={onClose}
            className="text-black px-8 py-3 rounded-lg font-medium flex items-center gap-3 mx-auto transition-colors text-base hover:opacity-90"
            style={{ backgroundColor: '#D8A159' }}
          >
            Get Started
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};

export default WelcomeModal;
