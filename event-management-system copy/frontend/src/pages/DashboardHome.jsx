import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaUsers, FaTags, FaEdit, FaTrash, FaCheck, FaTimes, FaUser } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useUserInterest } from '../contexts/UserInterestContext';
import { eventService, adminService } from '../services';
import InterestSelector from '../components/interests/InterestSelector';
import EventRecommendations from '../components/interests/EventRecommendations';

// Component for displaying user interests/categories 
const UserInterestsSection = ({ onManageCategories }) => {
  const { userInterests, categories, loading } = useUserInterest();
  
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Seçtiğiniz Kategoriler</h2>
        <div className="text-gray-500">Kategoriler yükleniyor...</div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Seçtiğiniz Kategoriler</h2>
        <button
          onClick={onManageCategories}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Kategorileri Yönet
        </button>
      </div>
      
      {userInterests.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {userInterests.map(interestId => {
              const category = categories.find(cat => cat.id === interestId);
              if (!category) return null;
              
              return (
                <div 
                  key={category.id}
                  className="flex items-center p-3 rounded-lg"
                  style={{ backgroundColor: `${category.color}20` }}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                    style={{ backgroundColor: category.color }}
                  >
                    <FaTags className="text-white" />
                  </div>
                  <span className="font-medium text-gray-800">{category.name}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p>Bu kategoriler size kişiselleştirilmiş etkinlik önerileri sunmak için kullanılır.</p>
          </div>
          <div className="mt-6 flex justify-center">
            <button
              onClick={onManageCategories} 
              className="text-primary hover:text-primary-dark flex items-center"
            >
              <FaEdit className="mr-1" />
              Kategorilerimi Düzenle
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">Henüz hiç kategori seçmediniz. Kişiselleştirilmiş etkinlik önerileri almak için ilgi alanlarınızı seçin.</p>
          <button 
            onClick={onManageCategories}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Kategori Seç
          </button>
        </div>
      )}
    </div>
  );
};

// Simple category selector component for the dashboard
const SimpleCategorySelector = ({ onShowInterests }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Kategorilerinizi Düzenleyin</h2>
        <p className="text-gray-600 mt-2">
          İlgilendiğiniz kategorileri aşağıdan seçin. Bunlar, etkinlik önerilerinizi kişiselleştirmek için kullanılacaktır.
        </p>
      </div>
      
      <div className="border-b border-gray-200 my-4"></div>
      
      <InterestSelector showTitle={false} />
      
      <div className="border-t border-gray-200 my-8 pt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Önerilen Etkinlikler</h3>
        <p className="text-gray-600 mb-4">
          Seçtiğiniz kategorilere göre, ilginizi çekebilecek bazı etkinlikler:
        </p>
        <EventRecommendations onManageCategories={onManageCategories} />
      </div>
    </div>
  );
};

// Stats card component
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

// Enhanced events management component
const EventsManagement = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await eventService.getEvents();
        setEvents(eventsData);
        setLoading(false);
      } catch (err) {
        console.error('Etkinlikleri yüklerken hata:', err);
        setError('Etkinlikler yüklenemedi. Lütfen daha sonra tekrar deneyin.');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingEvent({...editingEvent, [name]: value});
  };

  const saveEvent = async () => {
    try {
      await eventService.updateEvent(editingEvent.id, editingEvent);
      setEvents(events.map(event => 
        event.id === editingEvent.id ? editingEvent : event
      ));
      setEditingEvent(null);
    } catch (err) {
      console.error('Etkinlik güncellenirken hata:', err);
      alert('Etkinlik güncellenemedi. Lütfen tekrar deneyin.');
    }
  };

  const deleteEvent = async (id) => {
    try {
      await eventService.deleteEvent(id);
      setEvents(events.filter(event => event.id !== id));
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Etkinlik silinirken hata:', err);
      alert('Etkinlik silinemedi. Lütfen tekrar deneyin.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Etkinlikler</h2>
        <div className="text-gray-500">Etkinlikler yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Etkinlik Yönetimi</h2>
        <Link
          to="/events/create"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Yeni Etkinlik Oluştur
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Etkinlik
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tarih
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Konum
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kapasite
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.length > 0 ? (
              events.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{event.title}</div>
                        <div className="text-sm text-gray-500">{event.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(event.start_date).toLocaleDateString('tr-TR')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(event.start_date).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {event.location}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {event.attendees} / {event.capacity}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                      <div 
                        className="bg-primary h-2.5 rounded-full" 
                        style={{width: `${Math.min(100, (event.attendees / event.capacity) * 100)}%`}}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/events/${event.id}/edit`}
                      className="text-primary hover:text-primary-dark mr-4"
                    >
                      Düzenle
                    </Link>
                    <button
                      onClick={() => setShowDeleteConfirm(event.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  Henüz hiç etkinlik yok. Yeni bir etkinlik oluşturmak için "Yeni Etkinlik Oluştur" butonuna tıklayın.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-xl font-bold">Etkinliği Silmeyi Onayla</h3>
            </div>
            <div className="p-6">
              <p className="mb-4">Bu etkinliği silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={() => deleteEvent(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Users management component
const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersData = await adminService.getUsers();
        setUsers(usersData);
        setLoading(false);
      } catch (err) {
        console.error('Kullanıcıları yüklerken hata:', err);
        setError('Kullanıcılar yüklenemedi. Lütfen daha sonra tekrar deneyin.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({...editingUser, [name]: value});
  };

  const saveUser = async () => {
    try {
      const userDataToUpdate = { ...editingUser };
      
      if (editingUser.is_active !== undefined) {
        const isActive = typeof editingUser.is_active === 'string'
          ? editingUser.is_active === 'true'
          : !!editingUser.is_active;
          
        await adminService.activateUser(editingUser.id, isActive);
      }
      
      await adminService.updateUser(editingUser.id, userDataToUpdate);
      setUsers(users.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
      setEditingUser(null);
    } catch (err) {
      console.error('Kullanıcı güncellenirken hata:', err);
      alert('Kullanıcı güncellenemedi. Lütfen tekrar deneyin.');
    }
  };

  const deleteUser = async (id) => {
    try {
      await adminService.deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
      setShowDeleteConfirm(null);
    } catch (err) {
      console.error('Kullanıcı silinirken hata:', err);
      alert('Kullanıcı silinemedi. Lütfen tekrar deneyin.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Kullanıcılar</h2>
        <div className="text-gray-500">Kullanıcılar yükleniyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Kullanıcı Yönetimi</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kullanıcı
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                E-posta
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <FaUser className="text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser && editingUser.id === user.id ? (
                      <select 
                        name="role" 
                        value={editingUser.role || 'user'}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1"
                      >
                        <option value="user">Kullanıcı</option>
                        <option value="admin">Yönetici</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? 'Yönetici' : 'Kullanıcı'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingUser && editingUser.id === user.id ? (
                      <select 
                        name="is_active" 
                        value={String(editingUser.is_active)}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1"
                      >
                        <option value="true">Aktif</option>
                        <option value="false">Onay Bekliyor</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.is_active === true ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {user.is_active === true ? 'Aktif' : 'Onay Bekliyor'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {editingUser && editingUser.id === user.id ? (
                      <>
                        <button 
                          onClick={saveUser} 
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          <FaCheck title="Kaydet" />
                        </button>
                        <button 
                          onClick={() => setEditingUser(null)} 
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTimes title="İptal" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingUser({...user})}
                          className="text-primary hover:text-primary-dark mr-4"
                        >
                          <FaEdit title="Düzenle" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaTrash title="Sil" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  Henüz hiç kullanıcı yok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-xl font-bold">Kullanıcıyı Silmeyi Onayla</h3>
            </div>
            <div className="p-6">
              <p className="mb-4">Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={() => deleteUser(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardHome = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'admin';
  const [activeTab, setActiveTab] = useState(isAdmin ? 'users' : 'interests');
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalUsers: 0,
    newUsers: 0
  });
  
  useEffect(() => {
    if (isAdmin) {
      const fetchStats = async () => {
        try {
          const statsData = await adminService.getStats();
          setStats(statsData);
        } catch (err) {
          console.error('İstatistikleri yüklerken hata:', err);
        }
      };

      fetchStats();
    }
  }, [isAdmin]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hoş Geldiniz, {currentUser?.name || 'Kullanıcı'}!
            </h1>
            <p className="text-gray-600 mt-1">
              Kontrol Paneli Özeti
            </p>
          </div>
        </div>
        
        {isAdmin && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('users')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'users'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Kullanıcılar
                </button>
                <button
                  onClick={() => setActiveTab('events')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'events'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Etkinlikler
                </button>
                <button
                  onClick={() => setActiveTab('interests')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'interests'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Kategoriler
                </button>
              </nav>
            </div>
          </div>
        )}
        
        {!isAdmin && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px">
                <button
                  id="interests-tab-button"
                  onClick={() => setActiveTab('interests')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'interests'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Kategorilerim
                </button>
                <button
                  id="select-tab-button"
                  onClick={() => setActiveTab('select')}
                  className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                    activeTab === 'select'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Kategorileri Düzenle
                </button>
              </nav>
            </div>
          </div>
        )}
        
        {isAdmin && activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <UsersManagement />
          </div>
        )}
        
        {isAdmin && activeTab === 'events' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <EventsManagement />
          </div>
        )}
        
        {activeTab === 'interests' && (
          <UserInterestsSection onManageCategories={() => setActiveTab('select')} />
        )}
        
        {activeTab === 'select' && (
          <SimpleCategorySelector onShowInterests={() => setActiveTab('interests')} />
        )}
      </div>
    </div>
  );
};

export default DashboardHome; 