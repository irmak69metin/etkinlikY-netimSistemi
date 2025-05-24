import api from './api';

export const authService = {
  login: async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    
    const response = await api.post('/api/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/api/users/me');
    return response.data;
  },
  
  updateProfile: async (userData) => {
    const response = await api.put('/api/users/me', userData);
    return response.data;
  },
  
  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post('/api/auth/change-password', {
      old_password: oldPassword,
      new_password: newPassword
    });
    return response.data;
  },
  
  resetPassword: async (email) => {
    const response = await api.post('/api/auth/reset-password', { email });
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Clear all firstLoginCompleted flags
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('firstLoginCompleted_')) {
        localStorage.removeItem(key);
      }
    });
  }
};

export default authService; 