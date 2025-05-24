import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { FaCalendarAlt } from 'react-icons/fa';

const DateRangeFilter = ({
  startDate,
  endDate,
  onChange,
  minDate,
  maxDate,
  className = '',
  labelClassName = ''
}) => {
  const [localStartDate, setLocalStartDate] = useState(startDate || '');
  const [localEndDate, setLocalEndDate] = useState(endDate || '');

  // Update local state when props change
  useEffect(() => {
    if (startDate !== undefined) {
      setLocalStartDate(startDate);
    }
    if (endDate !== undefined) {
      setLocalEndDate(endDate);
    }
  }, [startDate, endDate]);

  // Handle start date change
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setLocalStartDate(newStartDate);
    
    if (onChange) {
      onChange({
        startDate: newStartDate,
        endDate: localEndDate
      });
    }
  };

  // Handle end date change
  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setLocalEndDate(newEndDate);
    
    if (onChange) {
      onChange({
        startDate: localStartDate,
        endDate: newEndDate
      });
    }
  };

  // Format dates for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className={`${className}`}>
      <div className="space-y-4">
        {/* Start Date */}
        <div>
          <label htmlFor="start-date" className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}>
            From
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCalendarAlt className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              id="start-date"
              value={localStartDate}
              min={minDate}
              max={localEndDate || maxDate}
              onChange={handleStartDateChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
          {localStartDate && (
            <p className="mt-1 text-xs text-gray-500">
              {formatDateForDisplay(localStartDate)}
            </p>
          )}
        </div>
        
        {/* End Date */}
        <div>
          <label htmlFor="end-date" className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}>
            To
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaCalendarAlt className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              id="end-date"
              value={localEndDate}
              min={localStartDate || minDate}
              max={maxDate}
              onChange={handleEndDateChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            />
          </div>
          {localEndDate && (
            <p className="mt-1 text-xs text-gray-500">
              {formatDateForDisplay(localEndDate)}
            </p>
          )}
        </div>
        
        {/* Clear Button */}
        {(localStartDate || localEndDate) && (
          <button
            type="button"
            onClick={() => {
              setLocalStartDate('');
              setLocalEndDate('');
              if (onChange) {
                onChange({ startDate: '', endDate: '' });
              }
            }}
            className="mt-2 text-sm text-primary hover:text-primary-dark"
          >
            Clear dates
          </button>
        )}
      </div>
    </div>
  );
};

DateRangeFilter.propTypes = {
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  minDate: PropTypes.string,
  maxDate: PropTypes.string,
  className: PropTypes.string,
  labelClassName: PropTypes.string
};

export default DateRangeFilter; 