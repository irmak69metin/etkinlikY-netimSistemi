import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaSort, FaSortUp, FaSortDown, FaCheck, FaChevronDown } from 'react-icons/fa';

const SortOptions = ({
  options = [],
  selectedOption = null,
  onChange,
  buttonLabel = 'Sort By',
  className = '',
  menuClassName = '',
  dropdownAlignment = 'right',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Handle option selection
  const handleSelect = (option) => {
    if (onChange) {
      onChange(option);
    }
    setIsOpen(false);
  };
  
  // Get the currently selected option label
  const getSelectedLabel = () => {
    if (!selectedOption) return buttonLabel;
    
    const selected = options.find(opt => 
      opt.value === selectedOption.value && opt.direction === selectedOption.direction
    );
    
    return selected ? selected.label : buttonLabel;
  };
  
  // Get icon for the sort direction
  const getSortIcon = (direction) => {
    if (!direction || direction === 'none') return <FaSort className="h-4 w-4" />;
    if (direction === 'asc') return <FaSortUp className="h-4 w-4" />;
    return <FaSortDown className="h-4 w-4" />;
  };
  
  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {getSortIcon(selectedOption?.direction)}
        <span className="mx-2">{getSelectedLabel()}</span>
        <FaChevronDown className="h-3 w-3 text-gray-500" />
      </button>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div 
          className={`origin-top-${dropdownAlignment} absolute ${dropdownAlignment}-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-30 ${menuClassName}`}
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {options.map((option, index) => (
              <button
                key={`${option.value}-${option.direction || 'none'}-${index}`}
                onClick={() => handleSelect(option)}
                className={`flex items-center justify-between w-full px-4 py-2 text-sm text-left ${
                  selectedOption && 
                  selectedOption.value === option.value && 
                  selectedOption.direction === option.direction
                    ? 'bg-gray-100 text-gray-900' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                role="menuitem"
              >
                <span>{option.label}</span>
                <div className="flex items-center space-x-2">
                  {getSortIcon(option.direction)}
                  {selectedOption && 
                   selectedOption.value === option.value && 
                   selectedOption.direction === option.direction && (
                    <FaCheck className="h-4 w-4 text-primary" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

SortOptions.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      direction: PropTypes.oneOf(['asc', 'desc', 'none'])
    })
  ).isRequired,
  selectedOption: PropTypes.shape({
    value: PropTypes.string.isRequired,
    direction: PropTypes.oneOf(['asc', 'desc', 'none']),
    label: PropTypes.string
  }),
  onChange: PropTypes.func.isRequired,
  buttonLabel: PropTypes.string,
  className: PropTypes.string,
  menuClassName: PropTypes.string,
  dropdownAlignment: PropTypes.oneOf(['left', 'right']),
};

export default SortOptions; 