import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaFilter, FaCalendarAlt, FaMapMarkerAlt, FaClock, FaTag, FaList, FaThLarge } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import FilterPanel from '../components/events/FilterPanel';
import SearchInput from '../components/common/SearchInput';
import { eventService } from '../services';

const EventCard = ({ event, variant }) => {
  // Format date
  const formattedDate = new Date(event.start_date).toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Calculate time from start_date and end_date
  const startTime = new Date(event.start_date).toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const endTime = new Date(event.end_date).toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const timeRange = `${startTime} - ${endTime}`;

  // Find category name from hardcoded categories
  const getCategoryName = () => {
    const categories = [
      { id: 1, name: 'Konferans' },
      { id: 2, name: 'Teknoloji' },
      { id: 3, name: 'İş Dünyası' },
      { id: 4, name: 'Pazarlama' },
      { id: 5, name: 'Tasarım' },
      { id: 6, name: 'Sağlık' },
      { id: 7, name: 'Eğitim' },
      { id: 8, name: 'Sanat' },
      { id: 9, name: 'Müzik' },
      { id: 10, name: 'Topluluk' },
      { id: 11, name: 'Networking' },
      { id: 12, name: 'Yemek' }
    ];
    
    const category = categories.find(cat => cat.id === event.category_id);
    return category ? category.name : 'Genel';
  };

  // Event card HTML - consider variant (horizontal or standard)
  if (variant === 'horizontal') {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden flex">
        {/* Image section removed */}
        
        {/* Content */}
        <div className="w-full p-4 flex flex-col">
          <div className="mb-2">
            <span className="inline-block bg-primary text-white text-xs py-1 px-2 rounded">
              {getCategoryName()}
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
          
          <div className="text-sm text-gray-600 space-y-2 mb-2 flex-grow">
            <div className="flex items-center">
              <FaCalendarAlt className="w-4 h-4 mr-2 text-gray-400" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center">
              <FaClock className="w-4 h-4 mr-2 text-gray-400" />
              <span>{timeRange}</span>
            </div>
            <div className="flex items-center">
              <FaMapMarkerAlt className="w-4 h-4 mr-2 text-gray-400" />
              <span>{event.location}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-auto">
            <span className="font-semibold text-primary">
              {event.price === 0 ? 'Ücretsiz' : `${event.price} TL`}
            </span>
            <Link 
              to={`/events/${event.id}`}
              className="px-4 py-1 bg-primary text-white rounded hover:bg-primary-dark transition-colors text-sm"
            >
              Detaylar
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  // Standard card view (default)
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Image section removed */}
      <div className="p-4">
        <div className="mb-2">
          <span className="inline-block bg-primary text-white text-xs py-1 px-2 rounded">
            {getCategoryName()}
          </span>
        </div>
        <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
        
        <div className="text-sm text-gray-600 space-y-2 mb-4">
          <div className="flex items-center">
            <FaCalendarAlt className="w-4 h-4 mr-2 text-gray-400" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <FaClock className="w-4 h-4 mr-2 text-gray-400" />
            <span>{timeRange}</span>
          </div>
          <div className="flex items-center">
            <FaMapMarkerAlt className="w-4 h-4 mr-2 text-gray-400" />
            <span>{event.location}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="font-semibold text-primary">
            {event.price === 0 ? 'Ücretsiz' : `${event.price} TL`}
          </span>
          <Link 
            to={`/events/${event.id}`}
            className="px-4 py-1 bg-primary text-white rounded hover:bg-primary-dark transition-colors text-sm"
          >
            Detaylar
          </Link>
        </div>
      </div>
    </div>
  );
};

const Events = () => {
  const { isAuthenticated } = useAuth();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  
  // Filter state - simplified to only include categories
  const [filters, setFilters] = useState({
    categories: []
  });
  
  // Hardcoded categories with counts initialized to 0
  const categories = [
    { id: 1, name: 'Konferans', count: 0 },
    { id: 2, name: 'Teknoloji', count: 0 },
    { id: 3, name: 'İş Dünyası', count: 0 },
    { id: 4, name: 'Pazarlama', count: 0 },
    { id: 5, name: 'Tasarım', count: 0 },
    { id: 6, name: 'Sağlık', count: 0 },
    { id: 7, name: 'Eğitim', count: 0 },
    { id: 8, name: 'Sanat', count: 0 },
    { id: 9, name: 'Müzik', count: 0 },
    { id: 10, name: 'Topluluk', count: 0 },
    { id: 11, name: 'Networking', count: 0 },
    { id: 12, name: 'Yemek', count: 0 }
  ];
  
  // Fetch events only
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError('');
      
      try {
        // Fetch events
        const eventsData = await eventService.getEvents();
        setEvents(eventsData);
        setFilteredEvents(eventsData);
        
        // Update category counts based on events
        const updatedCategories = categories.map(category => ({
          ...category,
          count: eventsData.filter(event => event.category_id === category.id).length
        }));
        
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Etkinlikler yüklenemedi. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  
  // Apply filters and search locally
  useEffect(() => {
    const applyFilters = () => {
      setLoading(true);
      
      try {
        // Filter events locally
        let filtered = [...events];
        
        // Filter by category
        if (filters.categories.length > 0) {
          filtered = filtered.filter(event => 
            filters.categories.includes(event.category_id)
          );
        }
        
        // Filter by search term
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(event => 
            event.title.toLowerCase().includes(term) || 
            event.description.toLowerCase().includes(term) || 
            event.location.toLowerCase().includes(term)
          );
        }
        
        setFilteredEvents(filtered);
      } catch (err) {
        console.error('Error applying filters:', err);
        setError('Filtreler uygulanamadı. Lütfen tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };
    
    applyFilters();
  }, [filters, searchTerm, events]);
  
  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  
  const handleFilterChange = (newFilters) => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
  };
  
  const handleClearFilters = () => {
    setFilters({
      categories: []
    });
    setSearchTerm('');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Etkinlikler</h1>
            <p className="text-gray-600">Harika etkinlikleri keşfedin ve katılın</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            {isAuthenticated && (
              <Link 
                to="/events/create" 
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
              >
                Etkinlik Oluştur
              </Link>
            )}
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter sidebar */}
          <div className="lg:w-1/4 w-full">
            <FilterPanel
              categories={categories} 
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          </div>
          
          {/* Main content */}
          <div className="lg:w-3/4 w-full">
            {/* Search and view options */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="md:w-2/3 w-full">
                  <SearchInput 
                    value={searchTerm}
                    onSearch={handleSearch}
                    placeholder="Etkinlik ara..."
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 text-sm">Görünüm:</span>
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                    aria-label="Grid view"
                  >
                    <FaThLarge className="text-gray-600" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                    aria-label="List view"
                  >
                    <FaList className="text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Events list */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p>{error}</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">Etkinlik bulunamadı</h3>
                <p className="text-gray-600 mb-4">Filtrelerinizi veya arama kriterlerinizi değiştirmeyi deneyin</p>
                <button 
                  onClick={handleClearFilters}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
                >
                  Filtreleri Temizle
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
                {filteredEvents.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    variant={viewMode === 'list' ? 'horizontal' : 'standard'}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events; 