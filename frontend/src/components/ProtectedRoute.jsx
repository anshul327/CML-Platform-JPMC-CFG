import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Shield, AlertCircle } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles = [], requireAuth = true }) => {
  const location = useLocation();
  
  // Get user data from localStorage
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const userData = localStorage.getItem('userData');

  console.log('ProtectedRoute Debug:', {
    token: !!token,
    userRole,
    userData: !!userData,
    allowedRoles,
    currentPath: location.pathname
  });

  // Check if user is authenticated
  const isAuthenticated = !!token && !!userRole && !!userData;

  // If authentication is not required, render children
  if (!requireAuth) {
    return children;
  }

  // If user is not authenticated, redirect to login
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location, message: 'Please log in to access this page' }} 
        replace 
      />
    );
  }

  // If no specific roles are required, allow access
  if (allowedRoles.length === 0) {
    return children;
  }

  // Check if user's role is allowed
  const isAuthorized = allowedRoles.includes(userRole);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-earth-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-100 rounded-full p-3">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. This area is restricted to: {allowedRoles.join(', ')}.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.history.back()}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Go Back
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.href = '/login';
              }}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Sign In as Different User
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute; 