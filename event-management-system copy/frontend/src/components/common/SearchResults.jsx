import React from 'react';
import PropTypes from 'prop-types';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchResults = ({
  results = [],
  isLoading = false,
  noResultsMessage = 'No results found',
  onItemClick,
  renderItem,
  searchTerm = '',
  onClearSearch,
  className = '',
  maxHeight = 'max-h-96',
}) => {
  // If there's a custom render function use it, otherwise use the default one
  const renderResultItem = renderItem || defaultRenderItem;

  // Loading state
  if (isLoading) {
    return (
      <div className={`bg-white rounded-md shadow-md p-4 ${className}`}>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="ml-2 text-gray-600">Searching...</span>
        </div>
      </div>
    );
  }

  // No results state
  if (results.length === 0 && searchTerm) {
    return (
      <div className={`bg-white rounded-md shadow-md p-6 text-center ${className}`}>
        <FaSearch className="mx-auto h-8 w-8 text-gray-300 mb-3" />
        <p className="text-gray-600 mb-4">{noResultsMessage}</p>
        {onClearSearch && (
          <button
            onClick={onClearSearch}
            className="text-primary hover:text-primary-dark text-sm font-medium flex items-center justify-center mx-auto"
          >
            <FaTimes className="mr-1" />
            Clear search
          </button>
        )}
      </div>
    );
  }

  // Results found
  if (results.length > 0) {
    return (
      <div className={`bg-white rounded-md shadow-md ${className}`}>
        <div className={`overflow-y-auto ${maxHeight}`}>
          <ul className="divide-y divide-gray-100">
            {results.map((item, index) => (
              <li 
                key={item.id || index} 
                onClick={() => onItemClick && onItemClick(item)}
                className="hover:bg-gray-50 cursor-pointer"
              >
                {renderResultItem(item)}
              </li>
            ))}
          </ul>
        </div>
        {searchTerm && onClearSearch && (
          <div className="px-4 py-2 border-t border-gray-100 text-right">
            <button
              onClick={onClearSearch}
              className="text-primary hover:text-primary-dark text-sm font-medium flex items-center justify-center ml-auto"
            >
              <FaTimes className="mr-1" />
              Clear search
            </button>
          </div>
        )}
      </div>
    );
  }

  // Default empty state (no search performed yet)
  return null;
};

// Default item renderer
const defaultRenderItem = (item) => (
  <div className="px-4 py-3">
    <div className="font-medium text-gray-900">{item.title || item.name}</div>
    {item.description && (
      <div className="text-sm text-gray-500 truncate">{item.description}</div>
    )}
  </div>
);

SearchResults.propTypes = {
  results: PropTypes.array,
  isLoading: PropTypes.bool,
  noResultsMessage: PropTypes.string,
  onItemClick: PropTypes.func,
  renderItem: PropTypes.func,
  searchTerm: PropTypes.string,
  onClearSearch: PropTypes.func,
  className: PropTypes.string,
  maxHeight: PropTypes.string,
};

export default SearchResults; 