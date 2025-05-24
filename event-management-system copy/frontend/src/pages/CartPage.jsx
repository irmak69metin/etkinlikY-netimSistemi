import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaShoppingCart } from 'react-icons/fa';
import { useShoppingCart } from '../contexts/ShoppingCartContext';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';

const CartPage = () => {
  const { cartItems, clearCart } = useShoppingCart();
  const isEmpty = cartItems.length === 0;
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Alışveriş Sepeti</h1>
        <Link
          to="/events"
          className="text-primary hover:text-primary-dark font-medium flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Alışverişe Devam Et
        </Link>
      </div>
      
      {isEmpty ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <FaShoppingCart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">Sepetiniz boş</h2>
          <p className="text-gray-600 mb-6">
            Henüz sepetinize etkinlik eklememişsiniz.
          </p>
          <Link
            to="/events"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark"
          >
            Etkinliklere Göz At
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  Sepet Ürünleri ({cartItems.length})
                </h2>
                <button
                  onClick={clearCart}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Sepeti Temizle
                </button>
              </div>
              <div className="divide-y divide-gray-200 px-6">
                {cartItems.map((item) => (
                  <CartItem key={item.eventId} item={item} />
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage; 