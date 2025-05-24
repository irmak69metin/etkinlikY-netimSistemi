import React from 'react';
import { Link } from 'react-router-dom';
import { useShoppingCart } from '../../contexts/ShoppingCartContext';

const CartSummary = () => {
  const { getCartTotal, cartItems } = useShoppingCart();
  
  // Calculate subtotal
  const subtotal = getCartTotal();
  
  // Calculate tax (assuming 10% tax rate)
  const taxRate = 0.10;
  const tax = subtotal * taxRate;
  
  // Calculate total
  const total = subtotal + tax;
  
  // Check if cart is empty
  const isEmpty = cartItems.length === 0;
  
  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Sipariş Özeti</h2>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Ara Toplam</span>
          <span className="font-medium">{subtotal.toFixed(2)} TL</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">KDV (%10)</span>
          <span className="font-medium">{tax.toFixed(2)} TL</span>
        </div>
        
        <div className="border-t border-gray-200 pt-4 flex justify-between">
          <span className="text-lg font-medium">Toplam</span>
          <span className="text-lg font-medium">{total.toFixed(2)} TL</span>
        </div>
      </div>
      
      <div className="mt-6">
        <Link
          to={isEmpty ? '#' : '/checkout'}
          className={`w-full block text-center px-4 py-3 rounded-md font-medium ${
            isEmpty 
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
              : 'bg-primary text-white hover:bg-primary-dark'
          }`}
          onClick={(e) => isEmpty && e.preventDefault()}
        >
          Ödemeye Geç
        </Link>
        
        <div className="mt-4 flex items-center justify-center">
          <Link 
            to="/events" 
            className="text-primary hover:text-primary-dark font-medium"
          >
            Alışverişe Devam Et
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartSummary; 