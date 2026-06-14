import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('client' | 'designer' | 'admin')[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-2">
          <div className="h-5 w-5 border border-black border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-[10px] tracking-widest text-neutral-400 uppercase">Verifying Digital Seal...</p>
        </div>
      </div>
    );
  }

  // Not logged in -> redirect straight to lookbook entrance matrix
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but missing role authority -> redirect back to safety boundary node
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};