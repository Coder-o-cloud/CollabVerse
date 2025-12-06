import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If no specific roles are required, allow access
  if (allowedRoles.length === 0) {
    return children;
  }

  // Check if user's role is in the allowed roles
  if (allowedRoles.includes(user.role)) {
    return children;
  }

  // Redirect to appropriate dashboard based on role
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'teacher':
      return <Navigate to="/teacher" replace />;
    default:
      return <Navigate to="/dashboard" replace />;
  }
};

export default ProtectedRoute;