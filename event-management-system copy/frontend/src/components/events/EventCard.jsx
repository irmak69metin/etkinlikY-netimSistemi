import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUserFriends } from 'react-icons/fa';

const EventCard = ({ 
  event, 
  variant = 'standard',
  ...props 
}) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${props.className || ''}`}
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors">
          <Link to={`/events/${event.id}`}>{event.title}</Link>
        </h3>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-start">
            <FaCalendarAlt className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-700">{event.date} • {event.time}</span>
          </div>
          
          <div className="flex items-start">
            <FaMapMarkerAlt className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-700">{event.location}</span>
          </div>
          
          <div className="flex items-start">
            <FaUserFriends className="text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-sm text-gray-700">{event.attendees} katılımcı</span>
          </div>
        </div>
      </div>
    </div>
  );
};

EventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    time: PropTypes.string,
    location: PropTypes.string.isRequired,
    category: PropTypes.string,
    attendees: PropTypes.number
  }).isRequired,
  variant: PropTypes.oneOf(['standard', 'compact', 'featured', 'horizontal']),
  className: PropTypes.string
};

export default EventCard; 