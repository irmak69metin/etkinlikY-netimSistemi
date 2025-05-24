import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaUser } from 'react-icons/fa';

const TicketList = ({ tickets, onCancelTicket }) => {
  // Group tickets by upcoming and past events
  const { upcomingTickets, pastTickets } = useMemo(() => {
    const now = new Date();
    
    const upcoming = tickets.filter(ticket => 
      new Date(ticket.event.date) > now && ticket.status !== 'canceled'
    );
    
    const past = tickets.filter(ticket => 
      new Date(ticket.event.date) <= now || ticket.status === 'canceled'
    );
    
    return {
      upcomingTickets: upcoming,
      pastTickets: past
    };
  }, [tickets]);

  // Format date helper
  const formatEventDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Geçersiz tarih';
      }
      return format(date, 'dd MMM yyyy HH:mm');
    } catch (error) {
      console.error('Tarih biçimlendirme hatası:', error);
      return 'Geçersiz tarih';
    }
  };
  
  // Format purchase date
  const formatPurchaseDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '';
      }
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      return '';
    }
  };
  
  // Get status style
  const getStatusStyle = (status) => {
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

  // Translate status
  const translateStatus = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'Aktif';
      case 'canceled':
        return 'İptal Edildi';
      case 'used':
        return 'Kullanıldı';
      default:
        return status;
    }
  };

  // Render ticket item
  const renderTicketItem = (ticket, showCancelOption = false) => (
    <div 
      key={ticket.id} 
      className="bg-white border border-gray-200 rounded-lg p-5 mb-4 hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col md:flex-row justify-between gap-4">
        {/* Event Info */}
        <div className="flex-1">
          <div className="flex items-start">
            <div className="bg-primary bg-opacity-10 p-2 rounded-full mr-4 mt-1">
              <FaTicketAlt className="text-primary text-xl" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">{ticket.event.title}</h3>
              <p className="flex items-center text-gray-600 text-sm mb-1">
                <FaCalendarAlt className="mr-2" />
                {formatEventDate(ticket.event.date)}
              </p>
              <p className="flex items-center text-gray-600 text-sm">
                <FaMapMarkerAlt className="mr-2" />
                {ticket.event.location}
              </p>
            </div>
          </div>
          
          {/* Ticket Details */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-3 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500">Bilet Türü</p>
              <p className="font-medium">{ticket.ticketType}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Adet</p>
              <p className="font-medium">{ticket.quantity}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Toplam Fiyat</p>
              <p className="font-medium">{ticket.totalPrice.toFixed(2)} TL</p>
            </div>
          </div>
        </div>
        
        {/* Status & Actions */}
        <div className="flex flex-col md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 mt-3 md:mt-0">
          <div className="flex flex-col md:items-end">
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mb-2 ${getStatusStyle(ticket.status)}`}>
              {translateStatus(ticket.status)}
            </span>
            <span className="text-xs text-gray-500 mb-2">Bilet #{ticket.id}</span>
            <span className="text-xs text-gray-500">Satın Alma: {formatPurchaseDate(ticket.purchaseDate)}</span>
          </div>
          
          {showCancelOption && ticket.status === 'active' && (
            <div className="mt-4">
              <button
                onClick={() => onCancelTicket(ticket)}
                className="px-3 py-1.5 text-sm border border-red-300 text-red-600 rounded hover:bg-red-50"
              >
                Bileti İptal Et
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Upcoming Events */}
      {upcomingTickets.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">Yaklaşan Etkinlikler</h2>
          <div>
            {upcomingTickets.map(ticket => renderTicketItem(ticket, true))}
          </div>
        </div>
      )}
      
      {/* Past Events */}
      {pastTickets.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">Geçmiş Etkinlikler</h2>
          <div>
            {pastTickets.map(ticket => renderTicketItem(ticket))}
          </div>
        </div>
      )}
      
      {/* No tickets message */}
      {tickets.length === 0 && (
        <div className="text-center py-10 bg-gray-50 rounded-lg">
          <FaTicketAlt className="text-gray-300 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">Bilet Bulunamadı</h3>
          <p className="text-gray-500 mb-4">Henüz hiç bilet satın almadınız.</p>
          <button 
            onClick={() => window.location.href = '/events'}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
          >
            Etkinliklere Göz At
          </button>
        </div>
      )}
    </div>
  );
};

TicketList.propTypes = {
  tickets: PropTypes.array.isRequired,
  onCancelTicket: PropTypes.func.isRequired
};

export default TicketList;
