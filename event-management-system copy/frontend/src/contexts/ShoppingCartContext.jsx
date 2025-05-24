import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const ShoppingCartContext = createContext();

// Custom hook to use the context
export const useShoppingCart = () => useContext(ShoppingCartContext);

// Provider component
export const ShoppingCartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('eventCart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Failed to parse cart data from localStorage', error);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('eventCart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  // Get the total number of items in cart
  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };
  
  // Calculate total price
  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity, 
      0
    );
  };
  
  // Add an item to cart
  const addToCart = (eventItem) => {
    setCartItems(currentItems => {
      // Check if the item is already in the cart
      const existingItemIndex = currentItems.findIndex(item => item.eventId === eventItem.eventId);
      
      if (existingItemIndex >= 0) {
        // Update quantity if item exists
        return currentItems.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantity: item.quantity + eventItem.quantity
            };
          }
          return item;
        });
      }
      
      // Add new item if it doesn't exist
      return [...currentItems, eventItem];
    });
  };
  
  // Remove an item from cart
  const removeFromCart = (eventId) => {
    setCartItems(currentItems => 
      currentItems.filter(item => item.eventId !== eventId)
    );
  };
  
  // Update quantity of an item
  const updateQuantity = (eventId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(eventId);
      return;
    }
    
    setCartItems(currentItems =>
      currentItems.map(item =>
        item.eventId === eventId ? { ...item, quantity } : item
      )
    );
  };
  
  // Clear the entire cart
  const clearCart = () => {
    setCartItems([]);
  };
  
  // Context value
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartTotal
  };
  
  return (
    <ShoppingCartContext.Provider value={value}>
      {children}
    </ShoppingCartContext.Provider>
  );
}; 