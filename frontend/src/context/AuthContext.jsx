import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, setAuthToken, getAuthToken } from '../services/api';

const AuthContext = createContext(null);

export const LEVEL_TITLES = {
  1: 'Novice Learner',
  2: 'Algorithmic Apprentice',
  3: 'Algorithmic Explorer',
  4: 'Data Structure Specialist',
  5: 'Optimization Master',
  6: 'FAANG Candidate',
  7: 'Principal Problem Solver',
  8: 'Grandmaster Engineer'
};

export const getLevelTitle = (lvl) => {
  if (lvl in LEVEL_TITLES) return LEVEL_TITLES[lvl];
  if (lvl > 8) return 'Grandmaster Engineer';
  return 'Novice Learner';
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [levelUpData, setLevelUpData] = useState(null);

  const dismissLevelUp = () => setLevelUpData(null);

  const triggerLevelUp = (data) => {
    setLevelUpData(data);
  };

  const addXp = (amount, reason = 'Problem Solving') => {
    if (!amount || amount <= 0) return;
    setUser(prevUser => {
      const currentXp = (prevUser && typeof prevUser.xp === 'number') ? prevUser.xp : 1450;
      const currentLevel = (prevUser && typeof prevUser.level === 'number') 
        ? prevUser.level 
        : Math.floor(currentXp / 600) + 1;
      
      const newXp = currentXp + amount;
      const newLevel = Math.floor(newXp / 600) + 1;
      const newTitle = getLevelTitle(newLevel);

      if (newLevel > currentLevel) {
        // Candidate reached the next level! Trigger congratulation notification
        setLevelUpData({
          level: newLevel,
          oldLevel: currentLevel,
          title: newTitle,
          xpGained: amount,
          totalXp: newXp,
          reason
        });
      }

      const updatedUser = {
        ...(prevUser || {
          _id: 'guest_user',
          name: 'Learner',
          email: 'guest@learnloop.ai'
        }),
        xp: newXp,
        level: newLevel,
        levelTitle: newTitle
      };

      return updatedUser;
    });
  };

  // Expose convenient test helpers in browser DevTools for immediate verification
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__addXp = (amount = 400, reason = 'XP Testing') => addXp(amount, reason);
      window.__testLevelUp = () => addXp(400, 'Test Level Up Celebration');
    }
  }, []);

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
      addXp,
      levelUpData,
      dismissLevelUp,
      triggerLevelUp,
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

