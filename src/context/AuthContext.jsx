import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/authApi';
import { STORAGE_KEYS } from '../utils/constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check user session on app load
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true);
      setAuthError(null);
      const response = await authApi.getMe();
      if (response?.success && response.data?.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
      }
    } catch {
      // Not authenticated or token expired
      setUser(null);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Login handler
  const login = async (credentials) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await authApi.login(credentials);
      if (response?.success && response.data?.user) {
        setUser(response.data.user);
        if (response.token) {
          localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
        }
        return { success: true, user: response.data.user };
      }
      throw new Error(response?.message || 'Login failed.');
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (userData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await authApi.register(userData);
      if (response?.success && response.data?.user) {
        setUser(response.data.user);
        if (response.token) {
          localStorage.setItem(STORAGE_KEYS.TOKEN, response.token);
        }
        return { success: true, user: response.data.user };
      }
      throw new Error(response?.message || 'Registration failed.');
    } catch (err) {
      setAuthError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Continue clearing local state even if logout request fails
    } finally {
      setUser(null);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
    }
  };

  const value = {
    user,
    loading,
    authError,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    isWorker: user?.role === 'worker',
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
