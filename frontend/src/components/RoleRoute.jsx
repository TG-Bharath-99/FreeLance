import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== requiredRole) {
    // Redirect to correct dashboard based on role
    return user.role === 'client' 
      ? <Navigate to="/client-dashboard" replace /> 
      : <Navigate to="/freelancer-dashboard" replace />;
  }

  return children;
};

export default RoleRoute;
