import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaTicketAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { eventService, ticketService } from '../services';

// Simple StatCard component
const StatCard = ({ icon, title, value, description, colorClass }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`${colorClass} bg-opacity-20 p-3 rounded-full`}>
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
};

// Simple EventCard component
const EventCard = ({ event }) => {
  const formattedDate = new Date(event.date).toLocaleDateString('tr-TR', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{event.title}</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-gray-500" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{event.category}</span>
          </div>
        </div>
        <Link 
          to={`/events/${event.id}`} 
          className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark text-sm"
        >
          Detayları Görüntüle
        </Link>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    eventsAttending: 0,
    eventsCreated: 0
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch real data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get user's tickets (events attending)
        const tickets = await ticketService.getUserTickets();
        
        // Get events created by the user (if admin)
        let createdEvents = [];
        if (currentUser?.role === 'admin') {
          createdEvents = await eventService.getEvents({ organizer_id: currentUser.id });
        }
        
        // Set stats
        setStats({
          eventsAttending: tickets.length || 0,
          eventsCreated: createdEvents.length || 0
        });
        
        // Get upcoming events (future events with nearest dates)
        const today = new Date().toISOString().split('T')[0];
        const events = await eventService.getEvents({ 
          start_date: today,
          limit: 3
        });
        
        setUpcomingEvents(events);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Panel verilerini yüklerken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentUser]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hoş Geldin, {currentUser?.name || 'Kullanıcı'}!
            </h1>
            <p className="text-gray-600 mt-1">
              Mevcut rol: <span className="font-semibold">{currentUser?.role === 'admin' ? 'Yönetici' : 'misafir'}</span>
              {currentUser?.role === 'admin' && (
                <span className="ml-2 text-primary">
                  - <Link to="/admin" className="underline hover:text-primary-dark">Yönetici Paneline Erişim</Link>
                </span>
              )}
            </p>
          </div>
          
          {currentUser?.role === 'admin' && (
            <Link
              to="/events/create"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
            >
              Yeni Etkinlik Oluştur
            </Link>
          )}
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Panel verileri yükleniyor...</p>
          </div>
        ) : (
          <>
            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <StatCard
                icon={<FaTicketAlt className="h-6 w-6 text-blue-600" />}
                title="Katıldığınız Etkinlikler"
                value={stats.eventsAttending}
                description="Kaydolduğunuz etkinlikler"
                colorClass="bg-blue-500"
              />
              
              {currentUser?.role === 'admin' && (
                <StatCard
                  icon={<FaCalendarAlt className="h-6 w-6 text-green-600" />}
                  title="Oluşturduğunuz Etkinlikler"
                  value={stats.eventsCreated}
                  description="Oluşturduğunuz toplam etkinlikler"
                  colorClass="bg-green-500"
                />
              )}
            </div>
            
            {/* Upcoming Events Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Yaklaşan Etkinlikler
                </h2>
                <Link
                  to="/events"
                  className="text-sm font-medium text-primary hover:text-primary-dark"
                >
                  Tüm Etkinlikleri Görüntüle →
                </Link>
              </div>
              
              {upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <p className="text-gray-500">Yaklaşan etkinlik bulunamadı.</p>
                  <Link
                    to="/events"
                    className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark text-sm"
                  >
                    Tüm Etkinlikleri İncele
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 