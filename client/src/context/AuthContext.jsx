import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check active session on initial mount
  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const user = await authApi.me();
        setIsAuthenticated(true);
        setAdminUser(user);
      } catch (err) {
        setIsAuthenticated(false);
        setAdminUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authApi.login({ email, password });
      setIsAuthenticated(true);
      setAdminUser(data.user || { email });
      return { success: true };
    } catch (err) {
      setIsAuthenticated(false);
      setAdminUser(null);
      return {
        success: false,
        error: 'Authentication failed. Please check your credentials.',
      };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setIsAuthenticated(false);
      setAdminUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
