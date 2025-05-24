import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaClock, 
  FaUsers, 
  FaTag, 
  FaDollarSign,
  FaShare,
  FaArrowLeft,
  FaShoppingCart,
  FaMinus,
  FaPlus,
  FaCheck
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import api from '../services/api';

const EventDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const { currentUser, isAuthenticated } = useAuth();
  const { addToCart } = useShoppingCart();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  
  const fetchEventData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/events/${id}`);
      setEvent(response.data);
      console.log('Fetched event data:', response.data);
    } catch (err) {
      console.error('Etkinlik detayları yüklenirken hata:', err);
      setError('Etkinlik detayları yüklenemedi. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [id]);
  
  // Re-fetch event data when user returns to this page
  useEffect(() => {
    const refreshEventData = () => {
      if (id) {
        fetchEventData();
      }
    };

    // Add event listener for when the page becomes visible again
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        refreshEventData();
      }
    });

    // Clean up event listener
    return () => {
      document.removeEventListener('visibilitychange', refreshEventData);
    };
  }, [id]);
  
  useEffect(() => {
    let timer;
    if (addedToCart) {
      timer = setTimeout(() => {
        setAddedToCart(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [addedToCart]);
  
  const handleShareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Bu etkinliğe göz atın: ${event.title}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Etkinlik bağlantısı panoya kopyalandı!');
    }
  };
  
  const increaseQuantity = () => {
    const remainingSpots = event.capacity - (event.attendees || 0);
    if (event && quantity < remainingSpots) {
      setQuantity(quantity + 1);
    }
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const handleAddToCart = () => {
    if (!event) return;
    
    const formattedDate = new Date(event.date || event.start_date).toLocaleDateString('tr-TR', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    
    const cartItem = {
      eventId: event.id,
      title: event.title,
      date: formattedDate,
      price: event.price || 0,
      quantity: quantity,
    };
    
    addToCart(cartItem);
    
    setAddedToCart(true);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3 text-lg font-medium text-primary">Etkinlik detayları yükleniyor...</span>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Hata</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <Link 
            to="/events" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
          >
            <FaArrowLeft className="mr-2" />
            Etkinliklere Dön
          </Link>
        </div>
      </div>
    );
  }
  
  if (!event) {
    return null;
  }
  
  const formattedDate = new Date(event.date || event.start_date).toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const attendees = event.attendees || 0;
  const capacity = event.capacity || 1;
  const attendancePercentage = Math.round((attendees / capacity) * 100);
  const spotsRemaining = capacity - attendees;
  const isNearCapacity = attendancePercentage >= 80;
  const isSoldOut = attendees >= capacity;
  
  const isFree = event.price === 0 || event.price === undefined;
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <Link 
            to="/events" 
            className="inline-flex items-center text-primary hover:text-primary-dark mb-4 sm:mb-0"
          >
            <FaArrowLeft className="mr-2" />
            Etkinliklere Dön
          </Link>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleShareEvent}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FaShare className="mr-2" />
              Paylaş
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="h-64 sm:h-80 md:h-96 bg-gray-200 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 w-full">
              <div className="inline-block bg-primary text-white px-3 py-1 rounded-lg text-sm font-medium mb-2">
                {typeof event.category === 'string' ? event.category : (event.category && event.category.name)}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {event.title}
              </h1>
              <p className="text-white/90">
                Düzenleyen: {typeof event.organizer === 'string' ? event.organizer : (event.organizer && event.organizer.name || 'Bilinmiyor')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Etkinlik Hakkında</h2>
              <div className="prose prose-primary max-w-none">
                {event.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Konum</h2>
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{event.location}</h3>
                <p className="text-gray-600">{event.address}</p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="text-center mb-6">
                {isFree ? (
                  <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium text-sm">
                    Ücretsiz Etkinlik
                  </span>
                ) : (
                  <span className="text-2xl font-bold text-gray-900">
                    {event.price.toFixed(2)} ₺
                  </span>
                )}
              </div>
              
              <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className={`${
                      isNearCapacity ? 'bg-yellow-500' : 'bg-primary'
                    } h-2.5 rounded-full`} 
                    style={{ width: `${attendancePercentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-500">
                    <FaUsers className="inline mr-1" /> {attendees} katılımcı
                  </span>
                  <span className={`font-medium ${isNearCapacity ? 'text-yellow-700' : 'text-gray-500'}`}>
                    {spotsRemaining} {spotsRemaining === 1 ? 'yer' : 'yer'} kaldı
                  </span>
                </div>
              </div>
              
              {isSoldOut ? (
                <div className="bg-gray-100 rounded-md p-4 mb-6 text-center">
                  <span className="font-medium text-gray-700">
                    Bu etkinlik tükenmiştir.
                  </span>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bilet Adedi
                    </label>
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <button 
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                        className={`px-4 py-2 ${quantity <= 1 ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        <FaMinus size={12} />
                      </button>
                      <span className="flex-1 text-center py-2">
                        {quantity}
                      </span>
                      <button 
                        onClick={increaseQuantity}
                        disabled={quantity >= spotsRemaining}
                        className={`px-4 py-2 ${quantity >= spotsRemaining ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                  </div>
                
                  <button
                    onClick={handleAddToCart}
                    className={`w-full flex items-center justify-center px-4 py-3 rounded-md font-medium text-white ${
                      addedToCart ? 'bg-green-600 hover:bg-green-700' : 'bg-primary hover:bg-primary-dark'
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <FaCheck className="mr-2" />
                        Sepete Eklendi
                      </>
                    ) : (
                      <>
                        <FaShoppingCart className="mr-2" />
                        Sepete Ekle
                      </>
                    )}
                  </button>
                  
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    {isFree ? "Rezervasyon gereklidir" : "Güvenli ödeme"}
                  </p>
                </>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Etkinlik Detayları</h3>
              
              <div className="space-y-4">
                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <FaCalendarAlt className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Tarih ve Saat</p>
                    <p className="text-sm text-gray-500">{formattedDate} • {event.time || "Belirtilmemiş"}</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <FaMapMarkerAlt className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Konum</p>
                    <p className="text-sm text-gray-500">{event.location}</p>
                    <p className="text-sm text-gray-500">{event.address}</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <FaUsers className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Kapasite</p>
                    <p className="text-sm text-gray-500">
                      Toplam {capacity} kişilik • {spotsRemaining} yer kaldı
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails; 