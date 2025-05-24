import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { useShoppingCart } from '../../contexts/ShoppingCartContext';

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useShoppingCart();
  
  const handleRemove = () => {
    removeFromCart(item.eventId);
  };
  
  const decreaseQuantity = () => {
    updateQuantity(item.eventId, item.quantity - 1);
  };
  
  const increaseQuantity = () => {
    updateQuantity(item.eventId, item.quantity + 1);
  };
  
  return (
    <div className="flex py-4 border-b border-gray-200 last:border-b-0">
      {/* Görsel bölümü kaldırıldı */}
      
      {/* Detaylar */}
      <div className="flex flex-1 flex-col">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <h3>
            <Link to={`/events/${item.eventId}`} className="hover:text-primary">
              {item.title}
            </Link>
          </h3>
          <p className="ml-4">{(item.price * item.quantity).toFixed(2)} TL</p>
        </div>
        
        <p className="mt-1 text-sm text-gray-500">{item.date}</p>
        
        <div className="flex items-center justify-between text-sm mt-2">
          {/* Miktar kontrolleri */}
          <div className="flex items-center border border-gray-300 rounded">
            <button 
              onClick={decreaseQuantity}
              disabled={item.quantity <= 1}
              className={`px-2 py-1 ${item.quantity <= 1 ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <FaMinus size={10} />
            </button>
            <span className="px-2 py-1 border-x border-gray-300 min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button 
              onClick={increaseQuantity}
              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
            >
              <FaPlus size={10} />
            </button>
          </div>
          
          {/* Kaldır butonu */}
          <button 
            onClick={handleRemove}
            className="font-medium text-red-600 hover:text-red-800 flex items-center"
          >
            <FaTrash className="mr-1" size={14} />
            Kaldır
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem; 