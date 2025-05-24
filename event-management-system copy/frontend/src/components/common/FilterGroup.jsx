import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FilterGroup = ({ 
  title, 
  children, 
  collapsible = true, 
  defaultOpen = true,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => {
    if (collapsible) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className={`border border-gray-200 rounded-md overflow-hidden ${className}`}>
      <div 
        className={`px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center ${collapsible ? 'cursor-pointer' : ''}`}
        onClick={toggleOpen}
      >
        <h3 className="font-medium text-gray-700">{title}</h3>
        {collapsible && (
          <div>
            {isOpen ? (
              <FaChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <FaChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </div>
        )}
      </div>
      {isOpen && (
        <div className="p-4 bg-white">
          {children}
        </div>
      )}
    </div>
  );
};

FilterGroup.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  collapsible: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  className: PropTypes.string,
};

export default FilterGroup; 