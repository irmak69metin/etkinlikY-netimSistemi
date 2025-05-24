import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import SearchInput from './SearchInput';
import SearchResults from './SearchResults';

const Search = ({
  placeholder = 'Search...',
  searchDelay = 300,
  onSearch,
  renderItem,
  onItemClick,
  results = [],
  isLoading = false,
  noResultsMessage = 'No results found',
  className = '',
  autoFocus = false,
  clearOnSelect = true,
  initialValue = '',
  showResultsOnFocus = false,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef(null);

  // Handle search term changes
  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
  };

  // Execute search
  const executeSearch = (term) => {
    if (onSearch) {
      onSearch(term);
    }
    // Only show results if there's a search term or we're showing results on focus
    setShowResults(!!term || (showResultsOnFocus && results.length > 0));
  };

  // Handle clicking on a search result
  const handleResultClick = (item) => {
    if (onItemClick) {
      onItemClick(item);
    }
    
    if (clearOnSelect) {
      setSearchTerm('');
      setShowResults(false);
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setShowResults(false);
    executeSearch('');
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={searchContainerRef}>
      <SearchInput
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearchChange}
        onSearch={executeSearch}
        onClear={handleClearSearch}
        searchDelay={searchDelay}
        autoFocus={autoFocus}
        onFocus={() => {
          if (showResultsOnFocus && (results.length > 0 || searchTerm)) {
            setShowResults(true);
          }
        }}
      />
      
      {showResults && (
        <div className="absolute z-10 left-0 right-0 mt-1">
          <SearchResults
            results={results}
            isLoading={isLoading}
            noResultsMessage={noResultsMessage}
            onItemClick={handleResultClick}
            renderItem={renderItem}
            searchTerm={searchTerm}
            onClearSearch={handleClearSearch}
          />
        </div>
      )}
    </div>
  );
};

Search.propTypes = {
  placeholder: PropTypes.string,
  searchDelay: PropTypes.number,
  onSearch: PropTypes.func,
  renderItem: PropTypes.func,
  onItemClick: PropTypes.func,
  results: PropTypes.array,
  isLoading: PropTypes.bool,
  noResultsMessage: PropTypes.string,
  className: PropTypes.string,
  autoFocus: PropTypes.bool,
  clearOnSelect: PropTypes.bool,
  initialValue: PropTypes.string,
  showResultsOnFocus: PropTypes.bool,
};

export default Search; 