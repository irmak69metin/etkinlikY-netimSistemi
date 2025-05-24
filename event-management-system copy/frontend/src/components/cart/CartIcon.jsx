import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useShoppingCart } from '../../contexts/ShoppingCartContext';

const CartIcon = () => {
  const { getCartCount } = useShoppingCart();
  const navigate = useNavigate();
  const itemCount = getCartCount();
  
  const handleCartClick = () => {
    navigate('/cart');
  };
  
  return (
    <button 
      className="relative p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
      onClick={handleCartClick}
      aria-label="Shopping cart"
    >
      <FaShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 rounded-full bg-primary text-white text-xs font-bold">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
};

export default CartIcon; 