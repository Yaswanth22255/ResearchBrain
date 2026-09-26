import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session from storage on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const storedToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const storedUser = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Session initialization error:', err);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('authUser');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password, rememberMe = true) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      const storage = rememberMe ? localStorage : sessionStorage;
      
      // Clean previous session before saving new
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('authUser');

      storage.setItem('authToken', data.token);
      storage.setItem('authUser', JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await authService.register(name, email, password);
      
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('authUser', JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);
      return data.user;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    return await authService.forgotPassword(email);
  };

  const resetPassword = async (token, newPassword) => {
    return await authService.resetPassword(token, newPassword);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('authUser');
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    forgotPassword,
    resetPassword,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
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

export default AuthContext;
