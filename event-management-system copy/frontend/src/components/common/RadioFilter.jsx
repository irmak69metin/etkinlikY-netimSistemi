import React from 'react';
import PropTypes from 'prop-types';

const RadioFilter = ({
  name,
  options = [],
  selectedValue = '',
  onChange,
  labelKey = 'label',
  valueKey = 'value',
  countKey = 'count',
  showCounts = true,
  allowDeselect = false,
  className = '',
  itemClassName = '',
  labelClassName = '',
  countClassName = ''
}) => {
  // Handle radio change
  const handleChange = (value) => {
    if (!onChange) return;
    
    // If allowDeselect is true and the value is already selected, deselect it
    if (allowDeselect && selectedValue === value) {
      onChange('');
    } else {
      onChange(value);
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
            const id = `${name}-${value}`;
            
            return (
              <li key={value} className={`flex items-center ${itemClassName}`}>
                <input
                  type="radio"
                  id={id}
                  name={name}
                  value={value}
                  checked={selectedValue === value}
                  onChange={() => handleChange(value)}
                  className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor={id}
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

RadioFilter.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  selectedValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool
  ]),
  onChange: PropTypes.func.isRequired,
  labelKey: PropTypes.string,
  valueKey: PropTypes.string,
  countKey: PropTypes.string,
  showCounts: PropTypes.bool,
  allowDeselect: PropTypes.bool,
  className: PropTypes.string,
  itemClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  countClassName: PropTypes.string
};

export default RadioFilter; 