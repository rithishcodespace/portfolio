import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070e10] flex items-center justify-center font-mono text-slate-300">
        <div className="flex items-center gap-3 bg-[#0a1619] border border-slate-800 p-4 rounded-lg shadow-xl">
          <div className="w-4 h-4 rounded-full border-2 border-[#00ff9d] border-t-transparent animate-spin" />
          <span className="text-xs font-bold tracking-wider text-slate-300">
            AUTHENTICATING_ADMIN_SESSION...
          </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
