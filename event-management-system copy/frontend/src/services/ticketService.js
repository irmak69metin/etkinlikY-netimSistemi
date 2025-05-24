import api from './api';

export const ticketService = {
  getUserTickets: async (skip = 0, limit = 100) => {
    const response = await api.get(`/api/tickets?skip=${skip}&limit=${limit}`);
    return response.data;
  },
  
  getTicket: async (ticketId) => {
    const response = await api.get(`/api/tickets/${ticketId}`);
    return response.data;
  },
  
  cancelTicket: async (ticketId) => {
    await api.delete(`/api/tickets/${ticketId}`);
    return true;
  }
};

export default ticketService; 