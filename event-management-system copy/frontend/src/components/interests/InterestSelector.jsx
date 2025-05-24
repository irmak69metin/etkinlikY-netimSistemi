import React, { useState, useEffect } from 'react';
import { FaCheck, FaMusic, FaLaptop, FaFutbol, FaUtensils, FaPalette, FaBriefcase, FaHeartbeat, FaGraduationCap } from 'react-icons/fa';
import { useUserInterest } from '../../contexts/UserInterestContext';

const InterestSelector = ({ onChange, showTitle = true }) => {
  const { categories, userInterests, loading, updateUserInterests } = useUserInterest();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Map category icons to components
  const iconMap = {
    'music': FaMusic,
    'laptop': FaLaptop,
    'futbol': FaFutbol,
    'utensils': FaUtensils,
    'palette': FaPalette,
    'briefcase': FaBriefcase,
    'heartbeat': FaHeartbeat,
    'graduation-cap': FaGraduationCap
  };

  // Initialize selected interests from context
  useEffect(() => {
    if (!loading) {
      setSelectedInterests(userInterests);
    }
  }, [userInterests, loading]);

  // Toggle interest selection
  const toggleInterest = (categoryId) => {
    setSelectedInterests(prev => {
      const newSelection = prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId];
      
      // Call onChange if provided by parent
      if (onChange) {
        onChange(newSelection);
      }
      
      return newSelection;
    });
  };

  // Save interests to context/backend
  const saveInterests = async () => {
    setIsUpdating(true);
    setMessage({ type: '', text: '' });
    
    try {
      const result = await updateUserInterests(selectedInterests);
      
      if (result.success) {
        setMessage({
          type: 'success',
          text: 'Your interests have been updated!'
        });
      } else {
        throw new Error('Failed to update interests');
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'An error occurred while updating your interests'
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {showTitle && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Select Your Preferred Categories
        </h3>
      )}
      
      {message.text && (
        <div className={`p-3 mb-4 rounded-md ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map(category => {
              const isSelected = selectedInterests.includes(category.id);
              const IconComponent = iconMap[category.icon] || FaPalette;
              
              return (
                <button
                  key={category.id}
                  onClick={() => toggleInterest(category.id)}
                  className={`
                    flex flex-col items-center justify-center p-4 rounded-lg transition-all
                    ${isSelected 
                      ? 'bg-primary/10 border-2 border-primary text-primary' 
                      : 'bg-gray-50 border-2 border-gray-100 text-gray-600 hover:bg-gray-100'}
                  `}
                >
                  <div className="relative">
                    <IconComponent size={24} style={{ color: isSelected ? '#5a67d8' : category.color }} />
                    {isSelected && (
                      <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full p-0.5">
                        <FaCheck size={10} />
                      </span>
                    )}
                  </div>
                  <span className="mt-2 text-sm font-medium">{category.name}</span>
                </button>
              )
            })}
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={saveInterests}
              disabled={isUpdating}
              className={`
                px-4 py-2 rounded-md text-white font-medium
                ${isUpdating 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-primary hover:bg-primary-dark'}
              `}
            >
              {isUpdating ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default InterestSelector; 