import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const RangeSlider = ({
  min = 0,
  max = 100,
  step = 1,
  defaultMinValue,
  defaultMaxValue,
  onChange,
  valuePrefix = '',
  valueSuffix = '',
  showLabels = true,
  showInputs = true,
  className = '',
  labelClassName = '',
  trackClassName = '',
  thumbClassName = '',
  inputClassName = '',
}) => {
  // Initialize values defaulting to full range if no defaults provided
  const [minValue, setMinValue] = useState(defaultMinValue !== undefined ? defaultMinValue : min);
  const [maxValue, setMaxValue] = useState(defaultMaxValue !== undefined ? defaultMaxValue : max);
  const rangeRef = useRef(null);

  // Update values when props change
  useEffect(() => {
    if (defaultMinValue !== undefined) {
      setMinValue(defaultMinValue);
    }
    if (defaultMaxValue !== undefined) {
      setMaxValue(defaultMaxValue);
    }
  }, [defaultMinValue, defaultMaxValue]);

  // Notify parent when values change
  useEffect(() => {
    if (onChange) {
      onChange({ min: minValue, max: maxValue });
    }
  }, [minValue, maxValue, onChange]);

  // Calculate percentage position for styling
  const getPercent = (value) => {
    return ((value - min) / (max - min)) * 100;
  };

  // Handle min thumb drag
  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxValue - step);
    setMinValue(value);
  };

  // Handle max thumb drag
  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minValue + step);
    setMaxValue(value);
  };

  // Handle min input change
  const handleMinInputChange = (e) => {
    const value = Number(e.target.value);
    if (isNaN(value)) return;
    
    const newValue = Math.max(min, Math.min(value, maxValue - step));
    setMinValue(newValue);
  };

  // Handle max input change
  const handleMaxInputChange = (e) => {
    const value = Number(e.target.value);
    if (isNaN(value)) return;
    
    const newValue = Math.min(max, Math.max(value, minValue + step));
    setMaxValue(newValue);
  };

  // Format value for display
  const formatValue = (value) => {
    return `${valuePrefix}${value}${valueSuffix}`;
  };

  return (
    <div className={`${className}`}>
      {/* Range labels */}
      {showLabels && (
        <div className="flex justify-between mb-2">
          <span className={`text-sm text-gray-600 ${labelClassName}`}>
            {formatValue(min)}
          </span>
          <span className={`text-sm text-gray-600 ${labelClassName}`}>
            {formatValue(max)}
          </span>
        </div>
      )}
      
      {/* Range inputs */}
      <div className="relative h-7 flex items-center">
        <div 
          className={`absolute h-1 bg-gray-200 rounded-full left-0 right-0 ${trackClassName}`}
          ref={rangeRef}
        >
          <div
            className="absolute h-1 bg-primary rounded-full"
            style={{
              left: `${getPercent(minValue)}%`,
              width: `${getPercent(maxValue) - getPercent(minValue)}%`,
            }}
          />
        </div>
        
        {/* Min value thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={handleMinChange}
          className={`absolute w-full h-1 bg-transparent appearance-none rounded-lg pointer-events-none z-20 ${thumbClassName}`}
          style={{
            // Custom thumb styling with pseudo-elements in tailwind
            WebkitAppearance: 'none',
            pointerEvents: 'auto',
            background: 'transparent',
          }}
        />
        
        {/* Max value thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={handleMaxChange}
          className={`absolute w-full h-1 bg-transparent appearance-none rounded-lg pointer-events-none z-20 ${thumbClassName}`}
          style={{
            // Custom thumb styling with pseudo-elements in tailwind
            WebkitAppearance: 'none',
            pointerEvents: 'auto',
            background: 'transparent',
          }}
        />
      </div>
      
      {/* Current value display */}
      {showInputs && (
        <div className="flex justify-between mt-4">
          <div className="w-1/2 pr-2">
            <label className="block text-xs text-gray-600 mb-1">Min Value</label>
            <input
              type="number"
              value={minValue}
              min={min}
              max={maxValue - step}
              step={step}
              onChange={handleMinInputChange}
              className={`w-full px-2 py-1 border border-gray-300 rounded-md text-sm ${inputClassName}`}
            />
          </div>
          <div className="w-1/2 pl-2">
            <label className="block text-xs text-gray-600 mb-1">Max Value</label>
            <input
              type="number"
              value={maxValue}
              min={minValue + step}
              max={max}
              step={step}
              onChange={handleMaxInputChange}
              className={`w-full px-2 py-1 border border-gray-300 rounded-md text-sm ${inputClassName}`}
            />
          </div>
        </div>
      )}
      
      {!showInputs && (
        <div className="flex justify-between mt-2">
          <span className="text-sm font-medium text-primary">
            {formatValue(minValue)}
          </span>
          <span className="text-sm font-medium text-primary">
            {formatValue(maxValue)}
          </span>
        </div>
      )}
    </div>
  );
};

RangeSlider.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  defaultMinValue: PropTypes.number,
  defaultMaxValue: PropTypes.number,
  onChange: PropTypes.func,
  valuePrefix: PropTypes.string,
  valueSuffix: PropTypes.string,
  showLabels: PropTypes.bool,
  showInputs: PropTypes.bool,
  className: PropTypes.string,
  labelClassName: PropTypes.string,
  trackClassName: PropTypes.string,
  thumbClassName: PropTypes.string,
  inputClassName: PropTypes.string,
};

export default RangeSlider; 