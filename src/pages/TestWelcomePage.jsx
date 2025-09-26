import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, HelpCircle, X } from 'lucide-react';
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
          <div className="max-w-sm mx-auto h-[264px] flex flex-col -mt-4">
            <h1 className="text-7xl font-bold text-white tracking-wide spark-logo mb-8">SPARK</h1>
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-3">
                <p className="text-gray-300 text-base leading-relaxed">
                  Stuck in a movement rut?
                </p>
                <p className="text-gray-300 text-base leading-relaxed">
                  Get prompts to spark your freestyle flow, served up in a deck for you to shuffle through during your next session.
                </p>
              </div>
            </div>
            <div className="h-8"></div> {/* Space for button */}
          </div>
        );
      
      case 2:
        return (
          <div className="max-w-sm mx-auto h-[264px] flex flex-col items-center justify-center">
            <div className="mb-8">
              <p className="text-gray-400 text-xs mb-1">
                (optional)
              </p>
              <p className="text-gray-300 text-lg leading-snug">
                Which movement types do you want to explore?
              </p>
            </div>
            <div className="flex items-start justify-center">
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
          </div>
        );
      
      case 3:
        return (
          <div className="max-w-sm mx-auto h-[264px] flex flex-col items-center justify-center">
            <div className="mb-8">
              <p className="text-gray-400 text-xs mb-1">
                (optional)
              </p>
              <p className="text-gray-300 text-lg leading-snug">
              Are there any themes you'd like to focus on?
              </p>
            </div>
            <div className="flex items-start justify-center">
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
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col overflow-hidden" style={{ background: 'transparent', width: '100vw !important', height: '100vh !important', minHeight: '100vh !important', margin: '0 !important', position: 'fixed !important', top: '0', bottom: '0', left: '0', right: '0', zIndex: 1 }}>
      <TestNavigationBar />
      <div className="flex-1 flex flex-col items-center justify-center p-4 pt-12">
        <div className="bg-black/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-xl w-full max-w-md h-[400px] pt-12 pb-16 px-8 text-center relative">
          {/* Help Button - Top Right Corner */}
          {(currentStep === 2 || currentStep === 3) && (
            <div className="absolute top-4 right-4 z-50" ref={helpButtonRef}>
              <button
                onClick={() => setShowHelpPopup(!showHelpPopup)}
                className="text-gray-400 hover:text-gray-300 transition-colors"
              >
                <HelpCircle size={16} />
              </button>
              {/* Help popup positioned below button */}
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
          {renderStep()}
          
          {/* Navigation Buttons - Positioned at bottom */}
          {currentStep === 1 ? (
            /* Single centered button for step 1 */
            <button 
              onClick={handleNext}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-black px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm hover:opacity-90 h-10"
              style={{ backgroundColor: '#D8A159' }}
            >
              Start
              <ChevronRight size={16} />
            </button>
          ) : (
            /* Full width layout for steps 2 and 3 */
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center">
              {/* Back Button - Far left */}
              <button 
                onClick={handleBack}
                className="text-gray-400 w-10 h-10 rounded-lg transition-colors hover:text-gray-300 hover:bg-gray-800/50 flex items-center justify-center"
              >
                <ChevronLeft size={20} />
              </button>
              
              {/* Next/Get Started Button - Far right */}
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
        
        {/* Step Indicator - Outside the modal */}
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
