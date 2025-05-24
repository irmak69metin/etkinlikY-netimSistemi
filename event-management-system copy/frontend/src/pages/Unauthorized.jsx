import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Unauthorized = () => {
  const { currentUser } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        <div className="flex justify-center mb-6">
          <FaExclamationTriangle className="h-24 w-24 text-warning" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          You don't have permission to access this page
        </h2>
        
        <div className="bg-gray-100 p-6 rounded-lg mb-8">
          <p className="text-lg text-gray-600 mb-4">
            {currentUser ? (
              <>You are logged in as: <span className="font-semibold">{currentUser.email}</span></>
            ) : (
              <>You need to log in to access this resource.</>
            )}
          </p>
          
          <p className="text-gray-600">
            If you believe you've received this message in error, please contact our support team.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark"
          >
            <FaHome className="mr-2" />
            Go to Home
          </Link>
          
          {currentUser ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FaArrowLeft className="mr-2" />
              Back to Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <FaArrowLeft className="mr-2" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Unauthorized; 