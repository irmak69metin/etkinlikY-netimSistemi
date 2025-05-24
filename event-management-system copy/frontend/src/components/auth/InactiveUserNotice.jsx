import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const InactiveUserNotice = () => {
  const { currentUser } = useAuth();
  
  // Only show for logged in but inactive users
  if (!currentUser || currentUser.is_active !== false) {
    return null;
  }
  
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            Your account is not activated yet. Please contact an administrator to activate your account.
            Until then, you will have limited access to the application.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InactiveUserNotice; 