import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Create context
const UserInterestContext = createContext();

// Custom hook to use the context
export const useUserInterest = () => useContext(UserInterestContext);

// Provider component
export const UserInterestProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [userInterests, setUserInterests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allEvents, setAllEvents] = useState([]);

  // Mock categories data (in a real app, this would come from an API)
  useEffect(() => {
    setCategories([
      { id: 1, name: 'Music', icon: 'music', color: '#FF5722' },
      { id: 2, name: 'Technology', icon: 'laptop', color: '#2196F3' },
      { id: 3, name: 'Sports', icon: 'futbol', color: '#4CAF50' },
      { id: 4, name: 'Food & Drink', icon: 'utensils', color: '#FFC107' },
      { id: 5, name: 'Art', icon: 'palette', color: '#9C27B0' },
      { id: 6, name: 'Business', icon: 'briefcase', color: '#607D8B' },
      { id: 7, name: 'Health', icon: 'heartbeat', color: '#E91E63' },
      { id: 8, name: 'Education', icon: 'graduation-cap', color: '#795548' }
    ]);

    // Set up all available events
    setAllEvents([
      {
        id: 1,
        title: 'Rock Music Festival',
        description: 'Experience an amazing rock festival with live performances by top bands!',
        date: '2023-08-15',
        time: '18:00',
        location: 'Central Park, New York',
        category: 'Music',
        attendees: 230,
        categoryId: 1  // Music
      },
      {
        id: 2,
        title: 'Modern Art Exhibition',
        description: 'Explore contemporary artworks from renowned artists around the world.',
        date: '2023-07-22',
        time: '10:00',
        location: 'Metropolitan Museum, New York',
        category: 'Art',
        attendees: 120,
        categoryId: 5  // Art
      },
      {
        id: 3,
        title: 'Summer Marathon 2023',
        description: 'Join the annual summer marathon and challenge yourself with runners from everywhere.',
        date: '2023-07-30',
        time: '08:00',
        location: 'Downtown, Boston',
        category: 'Sports',
        attendees: 500,
        categoryId: 3  // Sports
      },
      {
        id: 4,
        title: 'Tech Innovation Summit',
        description: 'Discover the latest technological innovations and network with industry leaders.',
        date: '2023-09-05',
        time: '09:00',
        location: 'Convention Center, San Francisco',
        category: 'Technology',
        attendees: 350,
        categoryId: 2  // Technology
      },
      {
        id: 5,
        title: 'Food & Wine Festival',
        description: 'Taste exquisite cuisines and premium wines from top chefs and wineries.',
        date: '2023-08-20',
        time: '12:00',
        location: 'Waterfront Park, Seattle',
        category: 'Food',
        attendees: 280,
        categoryId: 4  // Food & Drink
      },
      {
        id: 6,
        title: 'Business Leadership Conference',
        description: 'Learn from successful business leaders and gain insights on leadership strategies.',
        date: '2023-09-15',
        time: '09:30',
        location: 'Grand Hotel, Chicago',
        category: 'Business',
        attendees: 200,
        categoryId: 6  // Business
      },
      {
        id: 7,
        title: 'Wellness Yoga Retreat',
        description: 'Rejuvenate your mind and body with guided yoga sessions and wellness workshops.',
        date: '2023-08-10',
        time: '07:00',
        location: 'Mountain Resort, Colorado',
        category: 'Wellness',
        attendees: 75,
        categoryId: 7  // Health
      },
      {
        id: 8,
        title: 'Hackathon 2023',
        description: 'Collaborate with fellow developers to build innovative solutions within 48 hours.',
        date: '2023-07-28',
        time: '10:00',
        location: 'Tech Campus, Austin',
        category: 'Technology',
        attendees: 150,
        categoryId: 2  // Technology
      },
      {
        id: 9,
        title: 'Jazz Night Under Stars',
        description: 'Enjoy an enchanting evening of jazz music under the starry sky.',
        date: '2023-08-05',
        time: '20:00',
        location: 'Rooftop Garden, New Orleans',
        category: 'Music',
        attendees: 100,
        categoryId: 1  // Music
      },
      {
        id: 10,
        title: 'Photography Workshop',
        description: 'Learn advanced photography techniques from professional photographers.',
        date: '2023-07-25',
        time: '14:00',
        location: 'Art Center, Miami',
        category: 'Art',
        attendees: 40,
        categoryId: 5  // Art
      },
    ]);
  }, []);

  // Fetch user interests when user changes
  useEffect(() => {
    const fetchUserInterests = async () => {
      if (!currentUser) {
        setUserInterests([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // In a real app, this would be an API call
        // Simulating API call with timeout
        setTimeout(() => {
          // Mock data - in production this would come from the backend
          const mockInterests = [1, 3, 5]; // IDs of categories the user is interested in
          setUserInterests(mockInterests);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching user interests:', error);
        setLoading(false);
      }
    };

    fetchUserInterests();
  }, [currentUser]);

  // Update user interests
  const updateUserInterests = async (interests) => {
    try {
      setLoading(true);
      // In a real app, this would be an API call to update interests
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      setUserInterests(interests);
      
      // After updating interests, fetch new recommendations
      fetchRecommendations(interests);
      return { success: true };
    } catch (error) {
      console.error('Error updating user interests:', error);
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  // Fetch event recommendations based on user interests - filter by categoryId
  const fetchRecommendations = async (interests = userInterests) => {
    if (!currentUser || interests.length === 0) {
      setRecommendedEvents([]);
      return;
    }

    try {
      setLoading(true);
      // In a real app, this would be an API call
      // Here we're filtering the mock events based on user interests
      setTimeout(() => {
        // Filter events to only include those matching the user's interests
        const filteredEvents = allEvents.filter(event => 
          interests.includes(event.categoryId)
        );
        
        setRecommendedEvents(filteredEvents);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setLoading(false);
    }
  };

  // Initialize recommendations when interests change
  useEffect(() => {
    fetchRecommendations();
  }, [userInterests]);

  const value = {
    userInterests,
    categories,
    recommendedEvents,
    loading,
    updateUserInterests,
    fetchRecommendations
  };

  return (
    <UserInterestContext.Provider value={value}>
      {children}
    </UserInterestContext.Provider>
  );
}; 