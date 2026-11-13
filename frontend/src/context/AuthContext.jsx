import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, setAuthToken, getAuthToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = getAuthToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await authApi.getCurrentUser();
        setUser(data.user);
      } catch (err) {
        console.warn('Session expired or invalid, clearing token');
        setAuthToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authApi.login(email, password);
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (userData) => {
    const data = await authApi.register(userData);
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const demoLogin = async () => {
    const data = await authApi.demoLogin();
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const guestLogin = async () => {
    const data = await authApi.guestLogin();
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('learnloop_lc_handle');
  };

  const updateProfile = async (updates) => {
    try {
      const data = await authApi.updateProfile(updates);
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error('Failed to update profile:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      loading,
      login,
      register,
      demoLogin,
      guestLogin,
      logout,
      updateProfile,
      isAuthenticated: Boolean(user)
    }}>
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

