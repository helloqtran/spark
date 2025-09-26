import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, HelpCircle, X, Sparkles } from 'lucide-react';
import { getAllTypes, getAllTags, PROMPTS_DATABASE, normalizePromptItem } from '../data/prompts';
import { useUserDataContext } from '../contexts/UserDataContext';
import { createThreeStateToggle, createFilterParams } from '../utils/filterUtils';
import TestNavigationBar from '../components/TestNavigationBar';

const TestWelcomePage = () => {
  const navigate = useNavigate();
  const { favorites, hiddenPrompts, lists } = useUserDataContext();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState(new Set());
  const [excludedTypes, setExcludedTypes] = useState(new Set());
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [excludedTags, setExcludedTags] = useState(new Set());
  const [showHelpPopup, setShowHelpPopup] = useState(false);
  const helpButtonRef = useRef(null);


  // Handle click outside to close help popup
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showHelpPopup && helpButtonRef.current && !helpButtonRef.current.contains(event.target)) {
        setShowHelpPopup(false);
      }
    };

    if (showHelpPopup) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showHelpPopup]);

  const types = getAllTypes();
  const tags = getAllTags();

  // Use shared utility functions
  const toggleType = createThreeStateToggle(selectedTypes, excludedTypes, setSelectedTypes, setExcludedTypes);
  const toggleTag = createThreeStateToggle(selectedTags, excludedTags, setSelectedTags, setExcludedTags);

  // Calculate matching prompt count based on current filter selections
  const getMatchingPromptCount = useMemo(() => {
    let pool = PROMPTS_DATABASE.map(item => normalizePromptItem(item));
    
    // Apply type filters (inclusion)
    if (selectedTypes.size > 0) {
      pool = pool.filter(p => p.type && selectedTypes.has(p.type));
    }
    
    // Apply type exclusions
    if (excludedTypes.size > 0) {
      pool = pool.filter(p => !p.type || !excludedTypes.has(p.type));
    }
    
    // Apply tag filters (inclusion)
    if (selectedTags.size > 0) {
      pool = pool.filter(p => p.tags && p.tags.some(tag => selectedTags.has(tag)));
    }
    
    // Apply tag exclusions
    if (excludedTags.size > 0) {
      pool = pool.filter(p => !p.tags || !p.tags.some(tag => excludedTags.has(tag)));
    }
    
    return pool.length;
  }, [selectedTypes, excludedTypes, selectedTags, excludedTags]);

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - navigate to shuffle page with selected filters
      const filters = {
        selectedTypes,
        excludedTypes,
        selectedTags,
        excludedTags,
      };
      
      const params = createFilterParams(filters);
      const queryString = params.toString();
      navigate(`/shuffle${queryString ? `?${queryString}` : ''}`);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="max-w-sm mx-auto flex flex-col items-center justify-center space-y-4 pt-16">
            <h1 className="text-7xl font-bold text-white tracking-wide spark-logo">SPARK</h1>
            <div className="text-center">
              <p className="text-gray-300 text-base leading-relaxed max-w-xs">
                Generate a deck of movement prompts and spark your freestyle flow{' '}
                <Sparkles className="w-4 h-4 text-white inline" />
              </p>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="max-w-sm mx-auto flex flex-col items-center justify-center space-y-6 py-6">
            <div className="text-center">
              <p className="text-gray-300 text-lg leading-snug">
                Which movement types do you want to explore? <span className="text-gray-400 text-xs">(optional)</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {types.map(type => (
                <button
                  key={type.id}
                  onClick={() => toggleType(type.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedTypes.has(type.id)
                      ? 'text-black'
                      : excludedTypes.has(type.id)
                      ? 'bg-gray-700 text-gray-300 opacity-50'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  style={
                    selectedTypes.has(type.id) 
                      ? { backgroundColor: '#D8A159' }
                      : {}
                  }
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="max-w-sm mx-auto flex flex-col items-center justify-center space-y-6 py-6">
            <div className="text-center">
              <p className="text-gray-300 text-lg leading-snug">
                Are there any themes you'd like to focus on? <span className="text-gray-400 text-xs">(optional)</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {tags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedTags.has(tag)
                      ? 'text-black'
                      : excludedTags.has(tag)
                      ? 'bg-gray-700 text-gray-300 opacity-50'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  style={
                    selectedTags.has(tag) 
                      ? { backgroundColor: '#D8A159' }
                      : {}
                  }
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TestNavigationBar />
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="bg-black/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-xl w-full max-w-md min-h-[400px] relative">
          {/* Help Button - Top Right Corner */}
          {(currentStep === 2 || currentStep === 3) && (
            <div className="absolute top-4 right-4 z-50" ref={helpButtonRef}>
              <button
                onClick={() => setShowHelpPopup(!showHelpPopup)}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <HelpCircle size={16} />
              </button>
              {/* Help popup */}
              {showHelpPopup && (
                <div className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-sm border border-gray-700/50 rounded-lg shadow-xl p-3 text-center min-w-max z-50">
                  <div className="text-gray-400 text-xs space-y-0.5">
                    <p>Tap once to <b>include</b> prompts with that {currentStep === 2 ? 'type' : 'tag'}</p>
                    <p>Tap twice to <b>exclude</b> prompts with that {currentStep === 2 ? 'type' : 'tag'}</p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Step Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            {renderStep()}
            {/* Main button positioned inline for step 1, kept separate for others */}
            {currentStep === 1 && (
              <button 
                onClick={handleNext}
                className="text-black px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm hover:opacity-90 h-10 mt-6"
                style={{ backgroundColor: '#D8A159' }}
              >
                Customize my deck
                <ChevronRight size={16} />
              </button>
            )}
          </div>
          
          {/* Navigation Buttons */}
          <div className="absolute bottom-6 left-6 right-6">
            {currentStep === 1 ? (
              <div className="flex justify-center">
                <button 
                  onClick={() => navigate('/shuffle')}
                  className="text-gray-400 text-xs hover:text-gray-300 transition-colors underline"
                >
                  No need to customize? Click here to shuffle all prompts
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <button 
                  onClick={handleBack}
                  className="text-gray-400 w-10 h-10 rounded-lg transition-colors hover:text-gray-300 hover:bg-gray-800/50 flex items-center justify-center"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <button 
                  onClick={handleNext}
                  className="text-black px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm hover:opacity-90 h-10"
                  style={{ backgroundColor: '#D8A159' }}
                >
                  {currentStep === 2 ? 'Next' : `See ${getMatchingPromptCount} matching prompts`}
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Step Indicator */}
        <div className="flex justify-center mt-6 space-x-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full transition-colors ${
                step === currentStep ? 'bg-yellow-600' : 'bg-gray-600'
              }`}
              style={step === currentStep ? { backgroundColor: '#D8A159' } : {}}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestWelcomePage;
