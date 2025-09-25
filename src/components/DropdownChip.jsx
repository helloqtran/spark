import React, { useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * DropdownChip Component
 * 
 * A reusable dropdown component for filtering options with multi-select capability.
 * Used for type, tags, and lists filtering.
 */
const DropdownChip = React.memo(({ 
  label, 
  options, 
  selected, 
  excluded,
  onToggle, 
  onClear, 
  onOpenChange, 
  isOpen, 
  dropdownId 
}) => {
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = React.useState({ left: '50%', transform: 'translateX(-50%)' });

  // Recalculate position on window resize
  useEffect(() => {
    const handleResize = () => {
      if (isOpen && buttonRef.current) {
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const margin = 16;
        
        // Use actual dropdown width based on screen size
        const isMobile = viewportWidth < 640;
        const dropdownWidth = isMobile ? 200 : 224;
        
        let left = '50%';
        let transform = 'translateX(-50%)';
        
        // Check if dropdown would go off the left edge
        if (buttonRect.left - (dropdownWidth / 2) < margin) {
          left = `${margin}px`;
          transform = 'translateX(0)';
        }
        // Check if dropdown would go off the right edge
        else if (buttonRect.right + (dropdownWidth / 2) > viewportWidth - margin) {
          left = `calc(100% - ${margin}px)`;
          transform = 'translateX(-100%)';
        }
        
        setDropdownPosition({ left, transform });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const handleToggle = () => {
    const newOpen = !isOpen;
    if (newOpen && buttonRef.current) {
      // Calculate position to keep dropdown within viewport
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const margin = 16; // 1rem margin
      
      // Use actual dropdown width based on screen size
      const isMobile = viewportWidth < 640; // sm breakpoint
      const dropdownWidth = isMobile ? 200 : 224; // minWidth on mobile, w-56 on desktop
      
      let left = '50%';
      let transform = 'translateX(-50%)';
      
      // Check if dropdown would go off the left edge
      if (buttonRect.left - (dropdownWidth / 2) < margin) {
        left = `${margin}px`;
        transform = 'translateX(0)';
      }
      // Check if dropdown would go off the right edge
      else if (buttonRect.right + (dropdownWidth / 2) > viewportWidth - margin) {
        left = `calc(100% - ${margin}px)`;
        transform = 'translateX(-100%)';
      }
      
      setDropdownPosition({ left, transform });
    }
    if (onOpenChange) onOpenChange(newOpen);
  };

  // Three-state toggle: unchecked → included → excluded → unchecked
  const handleThreeStateToggle = (id) => {
    const isIncluded = selected.has(id);
    const isExcluded = excluded.has(id);
    
    if (!isIncluded && !isExcluded) {
      // First click: include
      onToggle(id, 'include');
    } else if (isIncluded && !isExcluded) {
      // Second click: exclude (remove from included, add to excluded)
      onToggle(id, 'exclude');
    } else if (!isIncluded && isExcluded) {
      // Third click: clear (remove from excluded)
      onToggle(id, 'clear');
    }
  };

  // Get the state of an option for display
  const getOptionState = (id) => {
    if (selected.has(id)) return 'included';
    if (excluded.has(id)) return 'excluded';
    return 'unchecked';
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isOpen && onOpenChange) {
          onOpenChange(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onOpenChange]);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className={`text-sm px-3 py-2 rounded-full border flex items-center gap-1.5 ${
          selected.size > 0 
            ? 'text-black border-white border-opacity-50' 
            : 'border-white border-opacity-50 text-gray-300 hover:bg-gray-800'
        }`}
        style={selected.size > 0 ? { backgroundColor: '#D8A159' } : {}}
        aria-label={`${label} filter (${selected.size} selected)`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {label}
        <ChevronDown 
          size={16} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      {isOpen && (
        <div 
          className="absolute z-40 mt-2 w-48 sm:w-56 bg-gray-900 border border-gray-600 rounded-lg shadow-lg p-2"
          style={{
            maxWidth: 'calc(100vw - 2rem)',
            minWidth: '200px',
            left: dropdownPosition.left,
            transform: dropdownPosition.transform
          }}
          role="listbox"
          aria-label={`${label} options`}
        >
          <div className="max-h-60 overflow-y-auto custom-scrollbar" style={{ touchAction: 'pan-y' }}>
            {options.length === 0 ? (
              <div className="text-sm text-gray-400 px-2 py-2">No custom lists yet</div>
            ) : (
              options.map(opt => {
                const state = getOptionState(opt.id);
                const getStateIcon = () => {
                  switch (state) {
                    case 'included': return <span className="text-xs font-bold" style={{ color: '#D8A159' }}>✓</span>;
                    case 'excluded': return <span className="text-xs text-gray-400 opacity-50">✗</span>;
                    default: return <span className="text-xs text-gray-400">○</span>;
                  }
                };
                
                const getStateColor = () => {
                  switch (state) {
                    case 'included': return 'text-gray-300 border-gray-500';
                    case 'excluded': return 'text-gray-400 border-gray-600 opacity-50';
                    default: return 'text-gray-400 border-gray-600';
                  }
                };

                return (
                  <div 
                    key={opt.id} 
                    className="flex items-center justify-between px-2 py-2 text-sm hover:bg-gray-700 rounded-md cursor-pointer"
                    onClick={() => handleThreeStateToggle(opt.id)}
                  >
                    <span className={`flex-1 ${state === 'excluded' ? 'text-gray-400 opacity-50' : 'text-gray-200'}`}>{opt.label}</span>
                    <div className={`flex items-center justify-center w-6 h-6 rounded border-2 ${getStateColor()}`}>
                      {getStateIcon()}
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <button 
              onClick={() => { onClear(); }} 
              className="text-base text-gray-400 hover:text-gray-200 px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors"
              aria-label="Clear all selections and exclusions"
            >
              Clear All
            </button>
            <button 
              onClick={() => { if (onOpenChange) onOpenChange(false); }} 
              className="text-base text-black rounded-lg px-4 py-2" 
              style={{ backgroundColor: '#D8A159' }}
              aria-label="Close dropdown"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

DropdownChip.displayName = 'DropdownChip';

export default DropdownChip;
