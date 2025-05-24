import React, { useState, useEffect } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import PropTypes from 'prop-types';

const SearchInput = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  onSearch,
  onClear,
  className = '',
  searchDelay = 300,
  showClearButton = true,
  disabled = false,
  autoFocus = false,
}) => {
  const [localValue, setLocalValue] = useState(value);
  
  // Update localValue if the prop value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);
  
  // Delay search to avoid excessive requests during typing
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (onSearch && localValue !== value) {
        onSearch(localValue);
      }
    }, searchDelay);

    return () => clearTimeout(delayDebounce);
  }, [localValue, onSearch, searchDelay, value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    if (onChange) onChange(e);
  };

  const handleClear = () => {
    setLocalValue('');
    if (onClear) onClear();
    if (onChange) onChange({ target: { value: '' } });
  };

  const handleKeyDown = (e) => {
    // Trigger search on Enter key
    if (e.key === 'Enter' && onSearch) {
      onSearch(localValue);
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaSearch className={`h-5 w-5 ${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
      </div>
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={`block w-full pl-10 pr-${showClearButton ? '10' : '3'} py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary ${
          disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'
        }`}
        placeholder={placeholder}
        disabled={disabled}
        autoFocus={autoFocus}
      />
      {showClearButton && localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 disabled:text-gray-300"
          disabled={disabled}
          aria-label="Clear search"
        >
          <FaTimes className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

SearchInput.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
  onClear: PropTypes.func,
  className: PropTypes.string,
  searchDelay: PropTypes.number,
  showClearButton: PropTypes.bool,
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
};

export default SearchInput; 