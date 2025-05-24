import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUserAlt } from 'react-icons/fa';
import Search from '../common/Search';
import api from '../../services/api';

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Search function using API
  const handleSearch = async (term) => {
    if (!term || term.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);

    try {
      // Get events from API
      const eventResponse = await api.get(`/api/events/search?q=${encodeURIComponent(term)}&limit=5`);
      const eventResults = (eventResponse.data || []).map(event => ({
        id: event.id,
        title: event.title,
        description: event.location,
        type: 'event',
        category: event.category,
        date: event.date
      }));

      // Get users from API
      const userResponse = await api.get(`/api/users/search?q=${encodeURIComponent(term)}&limit=3`);
      const userResults = (userResponse.data || []).map(user => ({
        id: user.id,
        title: user.name,
        description: user.email,
        type: 'user',
        image: user.avatar
      }));

      // Combine results
      setSearchResults([
        ...eventResults,
        ...userResults
      ]);
    } catch (error) {
      console.error('Arama hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle result item click
  const handleResultClick = (item) => {
    if (item.type === 'event') {
      navigate(`/events/${item.id}`);
    } else if (item.type === 'user') {
      navigate(`/users/${item.id}`);
    }
  };

  // Custom result item renderer
  const renderSearchResult = (item) => (
    <div className="flex items-center p-3">
      <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center mr-3">
        {item.type === 'event' ? (
          <FaCalendarAlt className="text-gray-500" />
        ) : (
          <FaUserAlt className="text-gray-500" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 truncate">{item.title}</div>
        <div className="text-sm text-gray-500 flex items-center">
          {item.type === 'event' ? (
            <>
              <FaMapMarkerAlt className="mr-1 text-xs" />
              <span className="truncate">{item.description}</span>
            </>
          ) : (
            <span className="truncate">{item.description}</span>
          )}
        </div>
      </div>
      <div className="ml-2">
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
          item.type === 'event' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {item.type === 'event' ? item.category || 'Etkinlik' : 'Kullanıcı'}
        </span>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-xl">
      <Search
        placeholder="Etkinlikler, kullanıcılar ve daha fazlasını ara..."
        searchDelay={400}
        onSearch={handleSearch}
        results={searchResults}
        isLoading={isLoading}
        onItemClick={handleResultClick}
        renderItem={renderSearchResult}
        noResultsMessage="Eşleşen etkinlik veya kullanıcı bulunamadı"
        className="w-full"
        clearOnSelect={true}
      />
    </div>
  );
};

export default SearchBar; 