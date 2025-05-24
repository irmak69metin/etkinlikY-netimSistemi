import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaBars, FaTimes, FaSignOutAlt, FaTicketAlt } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import CartIcon from '../cart/CartIcon';

const Header = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close menu when changing routes
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <FaCalendarAlt className="h-8 w-8 text-primary" />
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="ml-8 flex space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/') 
                    ? 'border-primary text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Ana Sayfa
              </Link>
              <Link
                to="/events"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/events') 
                    ? 'border-primary text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Etkinlikler
              </Link>
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/dashboard') 
                      ? 'border-primary text-gray-900' 
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Panel
                </Link>
              )}
              {isAuthenticated && (
                <Link
                  to="/my-tickets"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/my-tickets') 
                      ? 'border-primary text-gray-900' 
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  <FaTicketAlt className="mr-1" /> Biletlerim
                </Link>
              )}
            </nav>
          </div>
          
          {/* User Navigation */}
          <div className="flex items-center">
            {/* Cart Icon */}
            <div className="mr-2">
              <CartIcon />
            </div>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                <FaSignOutAlt className="mr-2" /> Çıkış Yap
              </button>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className="bg-primary text-white hover:bg-primary-dark px-3 py-2 rounded-md text-sm font-medium"
                >
                  Kaydol
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden ml-3">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <FaTimes className="block h-6 w-6" />
                ) : (
                  <FaBars className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Ana Sayfa
            </Link>
            <Link
              to="/events"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/events') 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Etkinlikler
            </Link>
            <Link
              to="/cart"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/cart') 
                  ? 'bg-primary text-white' 
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Sepet
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/dashboard') 
                    ? 'bg-primary text-white' 
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                Panel
              </Link>
            )}
            {isAuthenticated && (
              <>
                <Link
                  to="/my-tickets"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/my-tickets') 
                      ? 'bg-primary text-white' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FaTicketAlt className="inline mr-1" /> Biletlerim
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  <FaSignOutAlt className="inline mr-1" /> Çıkış Yap
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 