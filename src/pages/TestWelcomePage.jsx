import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { getAllTypes, getAllTags } from '../data/prompts';
import TestNavigationBar from '../components/TestNavigationBar';

const TestWelcomePage = ({ favorites = new Set(), hiddenPrompts = new Set(), lists = {} }) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState(new Set());
  const [excludedTypes, setExcludedTypes] = useState(new Set());
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [excludedTags, setExcludedTags] = useState(new Set());

  const types = getAllTypes();
  const tags = getAllTags();

  const toggleType = (typeId) => {
    // 3-click cycle: unselected → included → excluded → unselected
    if (selectedTypes.has(typeId)) {
      // Currently included, move to excluded
      setSelectedTypes(prev => {
        const newSet = new Set(prev);
        newSet.delete(typeId);
        return newSet;
      });
      setExcludedTypes(prev => new Set([...prev, typeId]));
    } else if (excludedTypes.has(typeId)) {
      // Currently excluded, move to unselected
      setExcludedTypes(prev => {
        const newSet = new Set(prev);
        newSet.delete(typeId);
        return newSet;
      });
    } else {
      // Currently unselected, move to included
      setSelectedTypes(prev => new Set([...prev, typeId]));
    }
  };

  const toggleTag = (tag) => {
    // 3-click cycle: unselected → included → excluded → unselected
    if (selectedTags.has(tag)) {
      // Currently included, move to excluded
      setSelectedTags(prev => {
        const newSet = new Set(prev);
        newSet.delete(tag);
        return newSet;
      });
      setExcludedTags(prev => new Set([...prev, tag]));
    } else if (excludedTags.has(tag)) {
      // Currently excluded, move to unselected
      setExcludedTags(prev => {
        const newSet = new Set(prev);
        newSet.delete(tag);
        return newSet;
      });
    } else {
      // Currently unselected, move to included
      setSelectedTags(prev => new Set([...prev, tag]));
    }
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - navigate to prompts page with selected filters
      const params = new URLSearchParams();
      
      // Add included types
      if (selectedTypes.size > 0) {
        params.set('includeTypes', Array.from(selectedTypes).join(','));
      }
      
      // Add excluded types
      if (excludedTypes.size > 0) {
        params.set('excludeTypes', Array.from(excludedTypes).join(','));
      }
      
      // Add included tags
      if (selectedTags.size > 0) {
        params.set('includeTags', Array.from(selectedTags).join(','));
      }
      
      // Add excluded tags
      if (excludedTags.size > 0) {
        params.set('excludeTags', Array.from(excludedTags).join(','));
      }
      
      // Navigate to prompts page with filters
      const queryString = params.toString();
      navigate(`/prompts${queryString ? `?${queryString}` : ''}`);
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
          <div className="max-w-sm mx-auto h-[264px] flex flex-col">
            <h1 className="text-7xl font-bold text-white tracking-wide spark-logo">SPARK</h1>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-300 text-lg leading-relaxed text-center">
                Get inspired with movement prompts designed to spark creativity in your freestyle practice.
              </p>
            </div>
            <div className="h-8"></div> {/* Space for button */}
          </div>
        );
      
      case 2:
        return (
          <div className="max-w-sm mx-auto h-[264px] flex flex-col">
            <div className="-mt-4">
              <p className="text-gray-400 text-sm mb-1">
                (optional)
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
                Which movement types do you want to explore?
              </p>
              <div className="text-gray-400 text-xs mt-1 space-y-0.5">
                <p>Tap once to <b>only</b> get prompts with that type </p>
                <p>Tap twice to <b>exclude</b> prompts with that type</p>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
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
            <div className="h-4"></div> {/* Spacer for button area */}
          </div>
        );
      
      case 3:
        return (
          <div className="max-w-sm mx-auto h-[264px] flex flex-col">
            <div className="-mt-4">
              <p className="text-gray-400 text-sm mb-1">
                (optional)
              </p>
              <p className="text-gray-300 text-lg leading-relaxed">
              Are there any themes you'd like to focus on?
              </p>
              <div className="text-gray-400 text-xs mt-1 space-y-0.5">
                <p>Tap once to <b>only</b> get prompts with that type </p>
                <p>Tap twice to <b>exclude</b> prompts with that type</p>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-center">
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
            <div className="h-4"></div> {/* Spacer for button area */}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col overflow-hidden" style={{ background: 'transparent', width: '100vw !important', height: '100vh !important', minHeight: '100vh !important', margin: '0 !important', position: 'fixed !important', top: '0', bottom: '0', left: '0', right: '0', zIndex: 1 }}>
      <TestNavigationBar 
        favorites={favorites}
        hiddenPrompts={hiddenPrompts}
        lists={lists}
      />
      <div className="flex-1 flex flex-col items-center justify-center p-4 pt-20">
        <div className="bg-black/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl shadow-xl w-full max-w-md h-[400px] pt-16 pb-16 px-8 text-center relative">
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
              Next
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
                {currentStep === 2 ? 'Next' : 'Get Started'}
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
