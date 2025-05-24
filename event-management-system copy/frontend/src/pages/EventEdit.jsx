import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaTag, FaDollarSign, FaInfoCircle, FaArrowLeft, FaClock, FaUsers, FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const EventEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAdmin } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '',
    location: '',
    address: '',
    category: '',
    capacity: 50,
    isFree: false,
    price: 0
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [hasAttendees, setHasAttendees] = useState(false);
  const [event, setEvent] = useState(null);
  
  const categories = [
    'Technology', 
    'Business', 
    'Marketing', 
    'Design', 
    'Health', 
    'Education', 
    'Arts', 
    'Music', 
    'Community', 
    'Networking', 
    'Food'
  ];
  
  // Load event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/events/${id}`);
        
        // Check if user has permission to edit this event
        if (!isAdmin && currentUser?.id !== response.data.organizer.id) {
          navigate('/unauthorized');
          return;
        }
        
        setEvent(response.data);
        
        // Check if event has attendees
        if (response.data.attendees > 0) {
          setHasAttendees(true);
        }
        
        // Transform the data to match our form structure
        setFormData({
          ...response.data,
          // Only keep the fields we need
          title: response.data.title,
          description: response.data.description,
          startDate: response.data.startDate,
          startTime: response.data.startTime,
          location: response.data.location,
          address: response.data.address,
          category: response.data.category,
          capacity: response.data.capacity,
          isFree: response.data.isFree,
          price: response.data.price
        });
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvent();
  }, [id, currentUser, isAdmin, navigate]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : 
              name === 'capacity' || name === 'price' ? Number(value) : 
              value
    });
    
    // Clear field error
    if (errors[name]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[name];
      setErrors(updatedErrors);
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Title validation
    if (!formData.title || !formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title should be at least 5 characters long';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title should not exceed 100 characters';
    }
    
    // Description validation
    if (!formData.description || !formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description should be at least 20 characters long';
    }
    
    // Start date validation
    if (!formData.startDate) {
      newErrors.startDate = 'Date is required';
    } else {
      const selectedDate = new Date(formData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Only show past date error if the event doesn't already have attendees
      if (selectedDate < today && !hasAttendees) {
        newErrors.startDate = 'Date cannot be in the past';
      }
    }
    
    // Start time validation
    if (!formData.startTime) {
      newErrors.startTime = 'Time is required';
    }
    
    // Location validation
    if (!formData.location || !formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    // Address validation
    if (!formData.address || !formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    // Category validation
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    // Capacity validation
    if (!formData.capacity) {
      newErrors.capacity = 'Capacity is required';
    } else if (formData.capacity < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    } else if (formData.capacity > 10000) {
      newErrors.capacity = 'Capacity cannot exceed 10,000';
    }
    
    // Special validation for capacity if event has attendees
    if (hasAttendees && formData.capacity < formData.attendees) {
      newErrors.capacity = `Capacity cannot be less than the current number of attendees (${formData.attendees})`;
    }
    
    // Price validation
    if (!formData.isFree) {
      if (formData.price === undefined || formData.price === null) {
        newErrors.price = 'Price is required for paid events';
      } else if (formData.price < 0) {
        newErrors.price = 'Price cannot be negative';
      } else if (formData.price > 10000) {
        newErrors.price = 'Price cannot exceed 10,000';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      document.getElementById(firstErrorField)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    
    try {
      setSubmitLoading(true);
      
      // Format event data
      const eventData = {
        ...formData,
        startDateTime: `${formData.startDate}T${formData.startTime}`,
        updatedAt: new Date().toISOString(),
      };
      
      await handleUpdateEvent(eventData);
    } catch (err) {
      setErrors({
        ...errors,
        general: err.message || 'Failed to update event. Please try again.'
      });
    } finally {
      setSubmitLoading(false);
    }
  };
  
  const handleUpdateEvent = async (eventData) => {
    try {
      await api.put(`/api/events/${id}`, eventData);
      navigate(`/events/${id}`);
    } catch (err) {
      console.error('Error updating event:', err);
      
      // Check if it's a Method Not Allowed error
      if (err.response && err.response.status === 405) {
        throw new Error('API does not support event updates. Please contact the administrator.');
      } else {
        throw new Error('Failed to update event. Please try again later.');
      }
    }
  };
  
  const handleDelete = async () => {
    if (confirmDelete) {
      try {
        setSubmitLoading(true);
        
        await handleDeleteEvent();
      } catch (err) {
        setErrors({
          ...errors,
          general: err.message || 'Failed to delete event. Please try again.'
        });
        setSubmitLoading(false);
      }
    } else {
      setConfirmDelete(true);
    }
  };
  
  const handleDeleteEvent = async () => {
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }
    
    try {
      await api.delete(`/api/events/${id}`);
      navigate('/events');
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event. Please try again later.');
    }
  };
  
  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3 text-lg font-medium text-primary">Loading event details...</span>
      </div>
    );
  }
  
  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Event Not Found</h1>
          <p className="text-gray-700 mb-6">The event you're looking for doesn't exist or may have been removed.</p>
          <Link 
            to="/events" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
          >
            <FaArrowLeft className="mr-2" />
            Back to Events
          </Link>
        </div>
      </div>
    );
  }
  
  if (unauthorized) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-700 mb-6">You don't have permission to edit this event.</p>
          <Link 
            to={`/events/${id}`} 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
          >
            <FaArrowLeft className="mr-2" />
            Back to Event
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center">
            <Link to={`/events/${id}`} className="mr-4 text-primary hover:text-primary-dark">
              <FaArrowLeft className="text-lg" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
          </div>
          <button
            onClick={handleDelete}
            className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              confirmDelete ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {confirmDelete ? 'Confirm Delete' : 'Delete Event'}
          </button>
        </div>
        
        {confirmDelete && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3 flex justify-between items-center w-full">
                <p className="text-sm text-red-700">
                  Are you sure you want to delete this event? This action cannot be undone.
                </p>
                <button
                  onClick={handleCancelDelete}
                  className="ml-4 text-sm font-medium text-red-700 hover:text-red-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {hasAttendees && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  This event has {formData.attendees} registered attendees. Changes to date, time, or location will affect them.
                </p>
                <p className="text-sm text-yellow-700 mt-2">
                  Capacity cannot be reduced below the current number of attendees.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {errors.general && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaInfoCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errors.general}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Event Title */}
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Title *
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCalendarAlt className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${errors.title ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-primary focus:border-primary`}
                    placeholder="Give your event a clear, catchy title"
                  />
                </div>
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
              </div>
              
              {/* Event Description */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${errors.description ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-primary focus:border-primary`}
                  placeholder="Describe your event, include details about what attendees can expect"
                />
                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
              </div>
              
              {/* Event Start Date */}
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${errors.startDate ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-primary focus:border-primary`}
                />
                {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>}
              </div>
              
              {/* Event Start Time */}
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Time *
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaClock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${errors.startTime ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-primary focus:border-primary`}
                  />
                </div>
                {errors.startTime && <p className="mt-1 text-sm text-red-600">{errors.startTime}</p>}
              </div>
              
              {/* Event Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Venue Name *
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaMapMarkerAlt className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${errors.location ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-primary focus:border-primary`}
                    placeholder="Name of the venue"
                  />
                </div>
                {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
              </div>
              
              {/* Event Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${errors.address ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-primary focus:border-primary`}
                  placeholder="Full address"
                />
                {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
              </div>
              
              {/* Event Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaTag className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${errors.category ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-primary focus:border-primary`}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
              </div>
              
              {/* Event Capacity */}
              <div>
                <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                  Capacity *
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUsers className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    min={hasAttendees ? formData.attendees : 1}
                    max="10000"
                    value={formData.capacity}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${errors.capacity ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-primary focus:border-primary`}
                    placeholder="Maximum number of attendees"
                  />
                </div>
                {errors.capacity && <p className="mt-1 text-sm text-red-600">{errors.capacity}</p>}
              </div>
              
              {/* Event Price */}
              <div className="flex flex-col">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="isFree"
                    name="isFree"
                    checked={formData.isFree}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="isFree" className="ml-2 block text-sm text-gray-700">
                    This is a free event
                  </label>
                </div>
                
                {!formData.isFree && (
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price *
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaDollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-2 border ${errors.price ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-primary focus:border-primary`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <Link
                to={`/events/${id}`}
                className="mr-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submitLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventEdit; 