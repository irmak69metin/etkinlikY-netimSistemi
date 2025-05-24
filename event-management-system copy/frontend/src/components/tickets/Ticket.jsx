import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { FaTicketAlt, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaEnvelope } from 'react-icons/fa';

const Ticket = ({ ticket }) => {
  // Format date helper
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return format(date, 'MMMM dd, yyyy h:mm a');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Get status background color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'used':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
      {/* Ticket Header */}
      <div className="bg-primary p-4 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">{ticket.event.title}</h3>
            <p className="flex items-center mt-1">
              <FaCalendarAlt className="mr-2" />
              {formatDate(ticket.event.date)}
            </p>
            <p className="flex items-center mt-1">
              <FaMapMarkerAlt className="mr-2" />
              {ticket.event.location}
            </p>
          </div>
          <div className="text-4xl">
            <FaTicketAlt />
          </div>
        </div>
      </div>

      {/* Ticket Body */}
      <div className="p-4">
        {/* Ticket Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Ticket Type</p>
              <p className="font-semibold">{ticket.ticketType}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Quantity</p>
              <p className="font-semibold">{ticket.quantity}</p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Total Price</p>
              <p className="font-semibold">${ticket.totalPrice.toFixed(2)}</p>
            </div>
          </div>
          
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Attendee</p>
              <p className="font-semibold">{ticket.attendee.name}</p>
              <p className="text-sm flex items-center mt-1">
                <FaEnvelope className="mr-1" />
                {ticket.attendee.email}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket Footer */}
      <div className="bg-gray-50 p-3 flex justify-between text-xs text-gray-500 border-t border-gray-200">
        <span>Ticket #{ticket.id}</span>
        <span>Purchased: {format(new Date(ticket.purchaseDate), 'MM/dd/yyyy')}</span>
      </div>
    </div>
  );
};

Ticket.propTypes = {
  ticket: PropTypes.object.isRequired
};

export default Ticket;
