import api from './api';

export const eventService = {
  getEvents: async (filters = {}) => {
    const { 
      category_id, 
      start_date, 
      end_date, 
      price_min, 
      price_max, 
      organizer_id, 
      search,
      skip = 0,
      limit = 100
    } = filters;
    
    let queryParams = new URLSearchParams();
    if (category_id) queryParams.append('category_id', category_id);
    if (start_date) queryParams.append('start_date', start_date);
    if (end_date) queryParams.append('end_date', end_date);
    if (price_min !== undefined) queryParams.append('price_min', price_min);
    if (price_max !== undefined) queryParams.append('price_max', price_max);
    if (organizer_id) queryParams.append('organizer_id', organizer_id);
    if (search) queryParams.append('search', search);
    queryParams.append('skip', skip);
    queryParams.append('limit', limit);
    
    const response = await api.get(`/api/events?${queryParams.toString()}`);
    return response.data;
  },
  
  getEvent: async (id) => {
    const response = await api.get(`/api/events/${id}`);
    return response.data;
  },
  
  createEvent: async (eventData) => {
    const response = await api.post('/api/events', eventData);
    return response.data;
  },
  
  updateEvent: async (id, eventData) => {
    try {
      const response = await api.put(`/api/events/${id}`, eventData);
      return response.data;
    } catch (err) {
      console.error('Error in updateEvent:', err);
      if (err.response && err.response.status === 405) {
        throw new Error('API does not support event updates (405 Method Not Allowed). Please contact the administrator.');
      }
      throw err;
    }
  },
  
  updateEventAttendees: async (id, quantity) => {
    // First get current event data
    const event = await eventService.getEvent(id);
    
    // Calculate new attendee count
    const currentAttendees = event.attendees || 0;
    const newAttendees = currentAttendees + quantity;
    
    // Update only the attendees field
    const response = await api.put(`/api/events/${id}`, {
      attendees: newAttendees
    });
    
    return response.data;
  },
  
  deleteEvent: async (id) => {
    await api.delete(`/api/events/${id}`);
    return true;
  },
  
  searchEvents: async (searchTerm, skip = 0, limit = 100) => {
    const response = await api.get(`/api/events/search?q=${encodeURIComponent(searchTerm)}&skip=${skip}&limit=${limit}`);
    return response.data;
  },
  
  registerForEvent: async (eventId) => {
    const response = await api.post(`/api/events/${eventId}/register`);
    return response.data;
  },
  
  getEventAttendees: async (eventId, skip = 0, limit = 100) => {
    const response = await api.get(`/api/events/${eventId}/attendees?skip=${skip}&limit=${limit}`);
    return response.data;
  },
  
  checkInAttendee: async (eventId, attendeeId) => {
    const response = await api.put(`/api/events/${eventId}/attendees/${attendeeId}/check-in`);
    return response.data;
  },
  
  removeAttendee: async (eventId, attendeeId) => {
    await api.delete(`/api/events/${eventId}/attendees/${attendeeId}`);
    return true;
  }
};

export default eventService; 