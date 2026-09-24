import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AuthPromptView } from './AuthPromptView';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  title?: string;
  subtitle?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  allowedRoles, 
  title, 
  subtitle 
}) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-text-muted">
          <div className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono">LOADING WORKSPACE...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Guest-first UX: Show informative explanation rather than dead-end redirect
    return <AuthPromptView title={title} subtitle={subtitle} />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
