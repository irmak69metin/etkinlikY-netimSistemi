import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowRight } from 'react-icons/fa';
import { useUserInterest } from '../../contexts/UserInterestContext';

const EventRecommendations = ({ onManageCategories }) => {
  const { recommendedEvents, loading, categories } = useUserInterest();

  // Map category names in English to Turkish
  const translateCategory = (categoryName) => {
    const categoryTranslations = {
      'Music': 'Müzik',
      'Technology': 'Teknoloji',
      'Sports': 'Spor',
      'Food & Drink': 'Yemek & İçecek',
      'Food': 'Yemek',
      'Art': 'Sanat',
      'Business': 'İş Dünyası',
      'Wellness': 'Sağlık & Zindelik',
      'Health': 'Sağlık',
      'Education': 'Eğitim'
    };
    
    return categoryTranslations[categoryName] || categoryName || 'Sınıflandırılmamış';
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          İlgi Alanlarınıza Göre Etkinlikler
        </h3>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        İlgi Alanlarınıza Göre Etkinlikler
      </h3>

      {recommendedEvents.length === 0 ? (
        <div className="text-center py-10 px-4">
          <div className="text-gray-400 mb-3">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-gray-700">Etkinlik Bulunamadı</h4>
          <p className="text-gray-500 mt-2">
            İlgilenebileceğiniz etkinlikleri görmek için tercih ettiğiniz kategorileri seçin
          </p>
          {onManageCategories ? (
            <button 
              onClick={onManageCategories}
              className="mt-4 inline-flex items-center text-primary hover:text-primary-dark"
            >
              Kategorileri Güncelle <FaArrowRight className="ml-2" size={12} />
            </button>
          ) : (
            <Link 
              to="/dashboard"
              className="mt-4 inline-flex items-center text-primary hover:text-primary-dark"
            >
              Panele Git <FaArrowRight className="ml-2" size={12} />
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {recommendedEvents.map(event => (
            <div 
              key={event.id} 
              className="flex flex-col sm:flex-row border border-gray-100 rounded-lg overflow-hidden transition-all hover:shadow-md"
            >
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-semibold text-primary bg-primary/10 rounded-full px-2 py-1">
                    {translateCategory(event.category)}
                  </span>
                  <h4 className="mt-2 text-gray-800 font-semibold text-lg line-clamp-1">
                    {event.title}
                  </h4>
                  <div className="mt-2 flex items-center text-gray-600 text-sm">
                    <FaCalendarAlt className="mr-1" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="mt-1 flex items-center text-gray-600 text-sm">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>{event.location}</span>
                  </div>
                </div>
                <div className="mt-3">
                  <Link 
                    to={`/events/${event.id}`}
                    className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark"
                  >
                    Detayları Görüntüle <FaArrowRight className="ml-1" size={10} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
          
          <div className="mt-2 text-center">
            <Link 
              to="/events" 
              className="text-sm font-medium text-primary hover:text-primary-dark"
            >
              Tüm Etkinlikleri Görüntüle
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventRecommendations; 