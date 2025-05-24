import api from './api';

export const adminService = {
  getStats: async () => {
    const response = await api.get('/api/admin/stats');
    return response.data;
  },
  
  getUsers: async (skip = 0, limit = 100) => {
    const response = await api.get(`/api/users?skip=${skip}&limit=${limit}`);
    return response.data;
  },
  
  updateUser: async (userId, userData) => {
    // Convert is_active from string to boolean if it exists
    if (userData.is_active !== undefined) {
      if (typeof userData.is_active === 'string') {
        userData.is_active = userData.is_active === 'true';
      }
    }
    
    const response = await api.put(`/api/users/${userId}`, userData);
    return response.data;
  },
  
  activateUser: async (userId, activate) => {
    const response = await api.patch(`/api/users/${userId}/activate?activate=${activate}`);
    return response.data;
  },
  
  deleteUser: async (userId) => {
    const response = await api.delete(`/api/users/${userId}`);
    return response.data;
  }
};

export default adminService; 