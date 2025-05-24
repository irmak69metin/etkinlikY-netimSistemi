import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUsers, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import EventRecommendations from '../components/interests/EventRecommendations';
import { useUserInterest } from '../contexts/UserInterestContext';

const Feature = ({ icon, title, description }) => {
  return (
    <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md transform transition-transform hover:scale-105">
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-center text-gray-600">{description}</p>
    </div>
  );
};

const Home = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const { userInterests } = useUserInterest();
  const hasInterests = userInterests && userInterests.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-primary to-primary-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Etkinlik Yönetim Sistemi
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-3xl">
              Her türlü etkinliği oluşturmak, yönetmek ve keşfetmek için kapsamlı bir platform.
              Güçlü araçlarımızla etkinlik planlama sürecinizi kolaylaştırın.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {isAuthenticated ? (
                <Link 
                  to="/dashboard" 
                  className="px-6 py-3 rounded-lg bg-white text-primary font-semibold hover:bg-gray-100 transition-colors"
                >
                  Panele Git
                </Link>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="px-6 py-3 rounded-lg bg-white text-primary font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Giriş Yap
                  </Link>
                  <Link 
                    to="/register" 
                    className="px-6 py-3 rounded-lg bg-transparent border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
                  >
                    Hesap Oluştur
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Categorized Events for logged in users with interests */}
      {isAuthenticated && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Kategorilerinize Göre Etkinlikler
            </h2>
            <EventRecommendations />
            {!hasInterests && (
              <div className="text-center mt-4">
                <p className="text-gray-600 mb-2">İlgilendiğiniz kategorileri seçerek size uygun etkinlikleri görün.</p>
                <Link 
                  to="/dashboard" 
                  className="text-primary font-medium hover:underline"
                >
                  Kategorileri Seçin →
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Güçlü Etkinlik Yönetim Özellikleri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <Feature 
              icon={<FaCalendarAlt className="text-2xl" />}
              title="Etkinlik Planlama"
              description="Etkinlikleri kolayca oluşturun ve düzenleyin. Biletleme, kayıt ve katılımcı yönetimini tek bir yerden yapın."
            />
            <Feature 
              icon={<FaUsers className="text-2xl" />}
              title="Katılımcı Yönetimi"
              description="RSVP'leri takip edin, hatırlatmalar gönderin ve entegre araçlarımızla katılımcılarınızla iletişim kurun."
            />
            <Feature 
              icon={<FaClock className="text-2xl" />}
              title="Gerçek Zamanlı Güncellemeler"
              description="Etkinlik değişiklikleri, duyurular ve önemli detaylar hakkında anlık bildirimlerle herkesi bilgilendirin."
            />
            <Feature 
              icon={<FaMapMarkerAlt className="text-2xl" />}
              title="Konum Hizmetleri"
              description="Katılımcıların etkinliklerinize giden yolu bulmalarına yardımcı olmak için haritaları, yol tariflerini ve mekan bilgilerini entegre edin."
            />
          </div>
        </div>
      </section>

      {/* Events Preview Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Yaklaşan Etkinlikler
            </h2>
            <Link 
              to="/events" 
              className="text-primary font-medium hover:underline"
            >
              Tüm Etkinlikleri Gör →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* This would typically be populated from an API */}
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-gradient-to-r from-blue-400 to-indigo-500 relative">
                <div className="absolute bottom-0 left-0 bg-primary text-white px-3 py-1 rounded-tr-lg">
                  25 Aralık 2023
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Yıllık Teknoloji Konferansı</h3>
                <p className="text-gray-600 mb-4">
                  Yılın en büyük teknoloji konferansına katılın. Sektör liderleriyle ağ kurun ve en son teknolojiler hakkında bilgi edinin.
                </p>
                <div className="flex items-center text-gray-500 mb-2">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>Teknoloji Kongre Merkezi</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <FaClock className="mr-2" />
                  <span>09:00 - 17:00</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-gradient-to-r from-green-400 to-emerald-500 relative">
                <div className="absolute bottom-0 left-0 bg-primary text-white px-3 py-1 rounded-tr-lg">
                  5 Ocak 2024
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Startup Networking Buluşması</h3>
                <p className="text-gray-600 mb-4">
                  Rahat bir ortamda kurucular, yatırımcılar ve sektör uzmanlarıyla bağlantı kurun. Ağlarını genişletmek isteyen girişimciler için mükemmel.
                </p>
                <div className="flex items-center text-gray-500 mb-2">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>Şehir Merkezi İnovasyon Merkezi</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <FaClock className="mr-2" />
                  <span>18:30 - 21:00</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow-md">
              <div className="h-48 bg-gradient-to-r from-purple-400 to-pink-500 relative">
                <div className="absolute bottom-0 left-0 bg-primary text-white px-3 py-1 rounded-tr-lg">
                  15 Ocak 2024
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Yaratıcı Sanatlar Atölyesi</h3>
                <p className="text-gray-600 mb-4">
                  Tüm beceri seviyeleri için bu uygulamalı atölyede sanatsal yönünüzü keşfedin. Malzemeler sağlanmaktadır, sadece yaratıcılığınızı getirin!
                </p>
                <div className="flex items-center text-gray-500 mb-2">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>Toplum Sanat Merkezi</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <FaClock className="mr-2" />
                  <span>13:00 - 16:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 