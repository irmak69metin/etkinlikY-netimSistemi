import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load user from localStorage on initial render
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          
          // Check if firstLoginCompleted flag exists in localStorage for this user
          // If the flag doesn't exist and the API doesn't provide a requirePasswordChange field
          if (!userData.requirePasswordChange && !localStorage.getItem(`firstLoginCompleted_${userData.id}`)) {
            // Set requirePasswordChange flag for first-time login
            userData.requirePasswordChange = true;
          }
          
          setCurrentUser(userData);
        } catch (err) {
          console.error('Failed to fetch current user:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, []);

  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.login(email, password);
      
      // Save token from API response
      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
      } else if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      // Handle inactive user status
      if (response.is_active === false) {
        const inactiveError = "Your account is not activated. Please contact an administrator.";
        setError(inactiveError);
        
        // Still set the user but mark as inactive
        const userData = await authService.getCurrentUser();
        userData.is_active = false;  // Ensure the inactive flag is set
        setCurrentUser(userData);
        
        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(userData));
        }
        
        throw new Error(inactiveError);
      }
      
      // Fetch user details
      const userData = await authService.getCurrentUser();
      
      // Check if this is the first login for this user
      // If the API doesn't provide a requirePasswordChange field, use localStorage
      if (!userData.requirePasswordChange && !localStorage.getItem(`firstLoginCompleted_${userData.id}`)) {
        // Set requirePasswordChange flag for first-time login
        userData.requirePasswordChange = true;
      }
      
      setCurrentUser(userData);
      
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.detail || 
                          err.message || 
                          'Invalid email or password';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role = 'user') => {
    setLoading(true);
    setError('');
    
    try {
      const userData = await authService.register({
        name,
        email,
        password,
        role
      });
      
      // After successful registration, log in the user
      await login(email, password, true);
      
      return userData;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.detail || 
                          err.message || 
                          'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const resetPassword = async (email) => {
    setLoading(true);
    setError('');
    
    try {
      return await authService.resetPassword(email);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.detail || 
                          err.message || 
                          'Password reset failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (userData) => {
    setLoading(true);
    setError('');
    
    try {
      const updatedUser = await authService.updateProfile(userData);
      
      // If this was a password change completion, mark first login as completed
      if (userData.hasOwnProperty('requirePasswordChange') && userData.requirePasswordChange === false) {
        localStorage.setItem(`firstLoginCompleted_${currentUser.id}`, 'true');
        updatedUser.requirePasswordChange = false;
      }
      
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.detail || 
                          err.message || 
                          'Failed to update profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const checkPasswordChangeRequired = () => {
    return currentUser && currentUser.requirePasswordChange === true;
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    resetPassword,
    updateProfile,
    checkPasswordChangeRequired,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 