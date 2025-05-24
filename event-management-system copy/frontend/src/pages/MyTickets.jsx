import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner, FaTimes } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import TicketList from '../components/tickets/TicketList';

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/tickets/my-tickets');
        console.log('Biletler yüklendi:', response.data);
        setTickets(response.data);
      } catch (err) {
        console.error('Biletleri yüklerken hata:', err);
        if (err.response?.status === 401) {
          setError('Biletlerinizi görmek için lütfen giriş yapın.');
          navigate('/login', { state: { from: '/my-tickets' } });
        } else {
          setError('Biletleriniz yüklenemedi. Lütfen daha sonra tekrar deneyin.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [navigate]);

  const handleCancelTicket = async (ticket) => {
    try {
      setSelectedTicket(ticket);
      setShowCancelConfirm(true);
    } catch (err) {
      console.error('Bilet iptal hazırlığında hata:', err);
      setError('Bilet iptali hazırlanırken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    }
  };
  
  const confirmCancelTicket = async () => {
    try {
      setCancelLoading(true);
      await api.delete(`/api/tickets/${selectedTicket.id}`);
      setTickets(tickets.filter(ticket => ticket.id !== selectedTicket.id));
      setCancelSuccess(true);
      setTimeout(() => {
        setShowCancelConfirm(false);
        setCancelSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Bilet iptal edilirken hata:', err);
      setError('Bilet iptal edilemedi. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Biletlerim</h1>
      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-3xl text-gray-500" />
        </div>
      ) : (
        <TicketList 
          tickets={tickets}
          onCancelTicket={handleCancelTicket}
        />
      )}
      
      {/* Bilet İptal Onayı */}
      {showCancelConfirm && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold">Bilet İptali</h2>
            </div>
            <div className="p-6">
              {!cancelSuccess ? (
                <>
                  <p className="mb-4">
                    <strong>{selectedTicket.event.title}</strong> etkinliği için biletinizi iptal etmek istediğinizden emin misiniz?
                  </p>
                  <p className="text-gray-600 mb-4">
                    Bu işlem geri alınamaz. İade politikaları etkinliğin koşullarına göre değişebilir.
                  </p>
                </>
              ) : (
                <div className="text-center py-4">
                  <svg className="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="mt-2 text-lg font-medium">Bilet başarıyla iptal edildi!</p>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end space-x-3">
              {!cancelSuccess && (
                <>
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    disabled={cancelLoading}
                  >
                    Bileti Koru
                  </button>
                  <button
                    onClick={confirmCancelTicket}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                    disabled={cancelLoading}
                  >
                    {cancelLoading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        İşleniyor...
                      </>
                    ) : (
                      'Evet, Bileti İptal Et'
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTickets;
