import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * ProtectedRoute component that ensures users are authenticated before 
 * rendering child components. Redirects to login if not authenticated.
 * Also supports role-based access control by checking for admin role.
 * For first-time login, redirects to password change page.
 * For inactive users, still allows access but with limited functionality.
 */
const ProtectedRoute = ({ 
  requireAdmin = false,
  allowWithPasswordChange = false,
  requireActive = true
}) => {
  const { currentUser, loading, isAuthenticated, isAdmin, checkPasswordChangeRequired } = useAuth();
  const location = useLocation();

  // Show loading spinner while authentication is being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3 text-lg font-medium text-primary">Loading...</span>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if password change is required and redirect if not allowed
  if (checkPasswordChangeRequired() && !allowWithPasswordChange && location.pathname !== '/change-password') {
    return <Navigate to="/change-password" state={{ from: location.pathname }} replace />;
  }

  // Check for admin role if required
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  // Check if account is active if required
  if (requireActive && currentUser.is_active === false && !allowWithPasswordChange) {
    // For inactive users, we'll still show the dashboard but with limited functionality
    // The InactiveUserNotice component will display a warning message
    if (location.pathname !== '/dashboard') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Render the protected route
  return <Outlet />;
};

export default ProtectedRoute; 