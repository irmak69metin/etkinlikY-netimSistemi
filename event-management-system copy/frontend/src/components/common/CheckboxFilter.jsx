import React from 'react';
import PropTypes from 'prop-types';

const CheckboxFilter = ({
  options = [],
  selectedValues = [],
  onChange,
  labelKey = 'label',
  valueKey = 'value',
  countKey = 'count',
  showCounts = true,
  className = '',
  itemClassName = '',
  labelClassName = '',
  countClassName = ''
}) => {
  // Handle checkbox change
  const handleChange = (value) => {
    if (!onChange) return;
    
    // Toggle the value
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  return (
    <div className={`${className}`}>
      {options.length === 0 ? (
        <p className="text-sm text-gray-500">No options available</p>
      ) : (
        <ul className="space-y-2">
          {options.map((option) => {
            const value = option[valueKey] || option;
            const label = option[labelKey] || option;
            const count = option[countKey];
            
            return (
              <li key={value} className={`flex items-center ${itemClassName}`}>
                <input
                  type="checkbox"
                  id={`filter-${value}`}
                  checked={selectedValues.includes(value)}
                  onChange={() => handleChange(value)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor={`filter-${value}`}
                  className={`ml-2 text-sm text-gray-600 flex-grow ${labelClassName}`}
                >
                  {label}
                </label>
                {showCounts && count !== undefined && (
                  <span className={`text-xs text-gray-500 ${countClassName}`}>
                    ({count})
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

CheckboxFilter.propTypes = {
  options: PropTypes.array.isRequired,
  selectedValues: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  labelKey: PropTypes.string,
  valueKey: PropTypes.string,
  countKey: PropTypes.string,
  showCounts: PropTypes.bool,
  className: PropTypes.string,
  itemClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  countClassName: PropTypes.string
};

export default CheckboxFilter; 