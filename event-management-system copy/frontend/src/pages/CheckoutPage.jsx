import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaExclamationTriangle } from 'react-icons/fa';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { eventService } from '../services';
import CartSummary from '../components/cart/CartSummary';

const CheckoutPage = () => {
  const { cartItems, getCartTotal, clearCart } = useShoppingCart();
  const { currentUser, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState(null);

  
  // Redirect to cart if it's empty
  useEffect(() => {
    if (cartItems.length === 0 && !orderComplete) {
      navigate('/cart');
    }
  }, [cartItems, navigate, orderComplete]);
  
  const handleCompletePurchase = async () => {
    // Debug token information
    const token = localStorage.getItem('token');
    console.log('Token exists:', !!token);
    if (token) {
      try {
        // Print token length and first/last few characters for debugging
        console.log('Token length:', token.length);
        console.log('Token preview:', token.substring(0, 10) + '...' + token.substring(token.length - 10));
        
        // Try to decode the JWT to check expiration
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log('Token payload:', payload);
          
          // Check if token is expired
          const expiryTime = payload.exp * 1000; // Convert to milliseconds
          const currentTime = Date.now();
          const timeRemaining = (expiryTime - currentTime) / 1000 / 60; // minutes remaining
          
          console.log('Token expires in:', Math.round(timeRemaining), 'minutes');
          
          if (expiryTime < currentTime) {
            console.error('Token is expired!');
            setError('Oturumunuz süresi dolmuş. Lütfen tekrar giriş yapın.');
            // setTimeout(() => navigate('/login', { state: { from: '/checkout' } }), 2000);
      return;
          }
        }
      } catch (e) {
        console.error('Error decoding token:', e);
      }
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('Starting checkout process');
      
      // Create order data from cart items
      const orderData = {
        items: cartItems.map(item => ({
          eventId: item.eventId,
          quantity: item.quantity,
          price: item.price
        })),
        customer: {
          name: currentUser?.name || '',
          email: currentUser?.email || '',
        },
        total: getCartTotal()
      };
      
      console.log('Sending order data:', orderData);
      
      // Submit order to backend
      const response = await api.post('/api/orders/', orderData);
      console.log('Order created successfully:', response.data);
      
      // Update event capacities for each purchased ticket
      for (const item of cartItems) {
        try {
          // Use the new updateEventAttendees function
          await eventService.updateEventAttendees(item.eventId, item.quantity);
          console.log(`Updated attendees for event ${item.eventId}, added ${item.quantity} attendees`);
        } catch (err) {
          console.error(`Failed to update capacity for event ${item.eventId}:`, err);
        }
      }
      
      // Process complete - clear cart and show confirmation
      setOrderId(response.data.id || 'SPN-' + Math.floor(Math.random() * 10000));
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error('Error processing order:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (orderComplete) {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <div className="rounded-full bg-green-100 p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <FaCheck className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Sipariş Onaylandı!</h1>
            <p className="text-gray-600 mb-6">
              Sipariş numaranız #{orderId} başarıyla işlendi.
            </p>
            <p className="text-gray-600 mb-8">
            Onay e-postası {currentUser?.email} adresine gönderildi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/my-tickets')}
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark"
              >
                Biletlerimi Görüntüle
              </button>
              <button
                onClick={() => navigate('/events')}
                className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Alışverişe Devam Et
              </button>
            </div>
          </div>
        </div>
    );
  }
  
  return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Ödeme</h1>
        </div>
        
      {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Summary */}
          <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Sipariş Özeti</h2>
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.eventId} className="flex justify-between border-b pb-3">
                  <div>
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-gray-500 text-sm">{item.date}</p>
                    <p className="text-gray-500 text-sm">Adet: {item.quantity}</p>
                  </div>
                  <span className="font-medium">{(item.price * item.quantity).toFixed(2)} TL</span>
                      </div>
              ))}
              <div className="flex justify-between pt-2 font-bold">
                <span>Toplam:</span>
                <span>{getCartTotal().toFixed(2)} TL</span>
                      </div>
                    </div>
                  </div>
                </div>
                
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Ödemeyi Tamamla</h2>
            <p className="text-gray-600 mb-4">
              Sepetinizdeki etkinlikler için ödemeyi tamamlamak üzeresiniz.
            </p>
                  <button
              onClick={handleCompletePurchase}
                    disabled={loading}
              className={`w-full py-3 px-4 rounded-md font-medium text-white ${
                loading ? 'bg-gray-400' : 'bg-primary hover:bg-primary-dark'
              }`}
                  >
              {loading ? 'İşleniyor...' : 'Ödemeyi Tamamla'}
                  </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage; 