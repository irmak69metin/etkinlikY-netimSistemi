import React from 'react';
import PropTypes from 'prop-types';
import { FaFilter, FaTag } from 'react-icons/fa';
import CheckboxFilter from '../common/CheckboxFilter';

const FilterPanel = ({
  filters,
  onFilterChange,
  onClearFilters,
  categories = [],
  title = 'Filtreler',
  className = '',
  isMobile = false,
  onClose
}) => {
  // Calculate if any filters are active
  const hasActiveFilters = () => {
    return (
      (filters.categories && filters.categories.length > 0)
    );
  };

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    if (onFilterChange) {
      onFilterChange({
        ...filters,
        [filterName]: value
      });
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    if (onClearFilters) {
      onClearFilters();
    }
  };

  return (
    <div className={`bg-white ${isMobile ? 'rounded-t-lg' : 'rounded-lg'} shadow-sm overflow-hidden ${className}`}>
      {/* Filter header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h2 className="font-medium text-gray-800 flex items-center">
          <FaFilter className="mr-2 text-gray-500" />
          {title}
        </h2>
      </div>

      {/* Filter content */}
      <div className="p-4">
        {/* Categories filter */}
        <div className="pb-4">
          <h3 className="font-medium text-gray-700 mb-3">Kategoriler</h3>
          <CheckboxFilter
            options={categories.map(cat => ({
              label: cat.name || cat,
              value: cat.id || cat,
              count: cat.count
            }))}
            selectedValues={filters.categories || []}
            onChange={(values) => handleFilterChange('categories', values)}
          />
        </div>
      </div>

      {/* Clear filters button */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <button
          type="button"
          onClick={handleClearFilters}
          className={`text-gray-600 text-sm font-medium hover:text-gray-800 ${!hasActiveFilters() ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!hasActiveFilters()}
        >
          Tümünü Temizle
        </button>
      </div>
    </div>
  );
};

FilterPanel.propTypes = {
  filters: PropTypes.shape({
    categories: PropTypes.array
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func,
  categories: PropTypes.array,
  title: PropTypes.string,
  className: PropTypes.string,
  isMobile: PropTypes.bool,
  onClose: PropTypes.func
};

export default FilterPanel; 