import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa]">
        <div className="w-8 h-8 rounded-full border-2 border-neutral-300 border-t-black animate-spin mb-3"></div>
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">
          Verifying Academic Credentials...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated user to /login while saving intended target route
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
