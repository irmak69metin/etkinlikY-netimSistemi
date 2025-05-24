import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaFilter, FaTimes, FaCalendarAlt, FaMapMarkerAlt, FaUserAlt, FaClock, FaDollarSign, FaTag } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

// Import our search components
import SearchInput from '../components/common/SearchInput';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState({
    events: [],
    users: [],
  });
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Filter categories for events
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Load and process search results
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery) {
        setResults({ events: [], users: [] });
        return;
      }

      setIsLoading(true);

      try {
        // Search events
        const eventResponse = await api.get(`/api/events/search?q=${encodeURIComponent(searchQuery)}`);
        const eventResults = eventResponse.data || [];

        // Search users (if authenticated)
        let userResults = [];
        if (isAuthenticated) {
          const userResponse = await api.get(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
          userResults = userResponse.data || [];
        }

        // Extract all unique categories for filtering
        const uniqueCategories = Array.from(
          new Set(eventResults.map(event => event.category).filter(Boolean))
        );

        setCategories(uniqueCategories);
        setResults({
          events: eventResults,
          users: userResults
        });
      } catch (error) {
        console.error('Error searching:', error);
      } finally {
        setIsLoading(false);
      }
    };

    performSearch();
  }, [searchQuery, isAuthenticated]);

  // Handle search input changes
  const handleSearch = (term) => {
    if (term) {
      setSearchParams({ q: term });
    } else {
      setSearchParams({});
    }
    setActiveTab('all');
    setSelectedCategory('');
  };

  // Handle category selection
  const handleCategoryChange = (category) => {
    setSelectedCategory(category === selectedCategory ? '' : category);
  };

  // Calculate filtered results based on active tab and selected category
  const getFilteredResults = () => {
    let filteredEvents = results.events;
    
    // Apply category filter if selected
    if (selectedCategory) {
      filteredEvents = filteredEvents.filter(event => event.category === selectedCategory);
    }
    
    // Return based on active tab
    switch (activeTab) {
      case 'events':
        return { events: filteredEvents, users: [] };
      case 'users':
        return { events: [], users: results.users };
      default:
        return { events: filteredEvents, users: results.users };
    }
  };

  const filteredResults = getFilteredResults();
  const totalResults = filteredResults.events.length + filteredResults.users.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Results</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <SearchInput
                placeholder="Search events, users, and more..."
                value={searchQuery}
                onSearch={handleSearch}
                autoFocus
                className="w-full"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 md:self-start"
            >
              <FaFilter className="mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Results tabs and filters */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('all')}
                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Results ({results.events.length + results.users.length})
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'events'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Events ({results.events.length})
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => setActiveTab('users')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'users'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Users ({results.users.length})
                </button>
              )}
            </nav>
          </div>

          {/* Filters */}
          {showFilters && (activeTab === 'all' || activeTab === 'events') && categories.length > 0 && (
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by category:</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
                {selectedCategory && (
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center"
                  >
                    <FaTimes className="mr-1" />
                    Clear filter
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Loading state */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-3 text-lg font-medium text-primary">Searching...</span>
          </div>
        ) : (
          <>
            {/* No results state */}
            {totalResults === 0 && searchQuery ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <FaSearch className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find anything matching "{searchQuery}".
                </p>
                <p className="text-gray-600 mb-6">
                  Try different keywords or check your spelling.
                </p>
                <button
                  onClick={() => handleSearch('')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <>
                {/* Results count */}
                {totalResults > 0 && (
                  <div className="mb-4">
                    <p className="text-gray-600">
                      {totalResults} {totalResults === 1 ? 'result' : 'results'} found for "{searchQuery}"
                      {selectedCategory && ` in category "${selectedCategory}"`}
                    </p>
                  </div>
                )}

                {/* Event results */}
                {filteredResults.events.length > 0 && (activeTab === 'all' || activeTab === 'events') && (
                  <div className="mb-8">
                    {activeTab === 'all' && <h2 className="text-xl font-bold text-gray-900 mb-4">Events</h2>}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredResults.events.map(event => (
                        <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                          <div className="p-4 flex-1 flex flex-col">
                            <div className="flex items-center mb-2">
                              <FaTag className="text-gray-500 mr-2" />
                              <span className="text-sm text-gray-600">{event.category}</span>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h3>
                            <p className="text-gray-600 text-sm mb-4 flex-1">{event.description.substring(0, 100)}...</p>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <FaCalendarAlt className="mr-2 text-gray-500" />
                                <span>{event.date}</span>
                              </div>
                              <div className="flex items-center">
                                <FaMapMarkerAlt className="mr-2 text-gray-500" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center">
                                <FaDollarSign className="mr-2 text-gray-500" />
                                <span>{event.isFree ? 'Free' : `$${event.price.toFixed(2)}`}</span>
                              </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                              <Link 
                                to={`/events/${event.id}`} 
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* User results */}
                {filteredResults.users.length > 0 && (activeTab === 'all' || activeTab === 'users') && (
                  <div>
                    {activeTab === 'all' && <h2 className="text-xl font-bold text-gray-900 mb-4">Users</h2>}
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                      <ul className="divide-y divide-gray-200">
                        {filteredResults.users.map(user => (
                          <li key={user.id}>
                            <Link to={`/users/${user.id}`} className="block hover:bg-gray-50">
                              <div className="px-4 py-4 flex items-center">
                                <div className="min-w-0 flex-1 flex items-center">
                                  <div className="flex-shrink-0">
                                    {user.avatar ? (
                                      <img 
                                        className="h-12 w-12 rounded-full object-cover" 
                                        src={user.avatar} 
                                        alt={user.name} 
                                      />
                                    ) : (
                                      <div className="h-12 w-12 rounded-full bg-primary-light flex items-center justify-center">
                                        <FaUserAlt className="h-5 w-5 text-primary" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="min-w-0 flex-1 px-4">
                                    <div>
                                      <p className="text-sm font-medium text-primary truncate">{user.name}</p>
                                      <p className="mt-1 flex items-center text-sm text-gray-500">
                                        <span className="truncate">{user.email}</span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {user.role}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* No search performed yet */}
        {!searchQuery && !isLoading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FaSearch className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Search for events and more</h3>
            <p className="text-gray-600 mb-4">
              Enter keywords in the search box above to find events, users, and more.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage; 