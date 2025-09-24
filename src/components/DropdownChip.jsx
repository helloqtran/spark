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
  onToggle, 
  onClear, 
  onOpenChange, 
  isOpen, 
  dropdownId 
}) => {
  const dropdownRef = useRef(null);

  const handleToggle = () => {
    const newOpen = !isOpen;
    if (onOpenChange) onOpenChange(newOpen);
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
        onClick={handleToggle}
        className={`text-sm px-3 py-2 rounded-full border flex items-center gap-1.5 ${
          selected.size > 0 
            ? 'text-black border-white' 
            : 'border-gray-500 text-gray-300 hover:bg-gray-800'
        }`}
        style={selected.size > 0 ? { backgroundColor: '#D8A159' } : {}}
        aria-label={`${label} filter (${selected.size} selected)`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {label}{selected.size > 0 ? ` (${selected.size})` : ''}
        <ChevronDown 
          size={16} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      {isOpen && (
        <div 
          className="absolute z-40 mt-2 w-48 sm:w-56 bg-gray-800 border border-gray-600 rounded-lg shadow-lg p-2"
          style={{
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: 'calc(100vw - 2rem)',
            minWidth: '200px'
          }}
          role="listbox"
          aria-label={`${label} options`}
        >
          <div className="max-h-60 overflow-y-auto custom-scrollbar" style={{ touchAction: 'pan-y' }}>
            {options.length === 0 ? (
              <div className="text-sm text-gray-400 px-2 py-2">No options</div>
            ) : (
              options.map(opt => (
                <label 
                  key={opt.id} 
                  className="flex items-center justify-between px-2 py-2 text-sm hover:bg-gray-700 rounded-md cursor-pointer"
                >
                  <span className="text-gray-200">{opt.label}</span>
                <input
                  type="checkbox"
                  checked={selected.has(opt.id)}
                  onChange={() => onToggle(opt.id)}
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-yellow-400 focus:ring-yellow-400 focus:ring-2 accent-yellow-400"
                  style={{ accentColor: '#D8A159' }}
                  aria-label={`Toggle ${opt.label}`}
                />
                </label>
              ))
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <button 
              onClick={() => { onClear(); }} 
              className="text-base text-gray-400 hover:text-gray-200 px-3 py-2 rounded-lg hover:bg-gray-700/50 transition-colors"
              aria-label="Clear all selections"
            >
              Clear
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
