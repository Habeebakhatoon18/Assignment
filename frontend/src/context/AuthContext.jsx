import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  getProfile,
  loginUser,
  registerUser,
  logoutUser,
  loginAdmin,
  logoutAdmin
} from '../lib/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      // Check if admin is logged in first (from localStorage)
      const adminData = localStorage.getItem('admin');
      if (adminData) {
        try {
          setAdmin(JSON.parse(adminData));
          setLoading(false);
          return; // Don't check for user if admin is logged in
        } catch (e) {
          localStorage.removeItem('admin');
        }
      }

      // Check if user is logged in via cookie (only if no admin)
      try {
        const data = await getProfile();
        if (data.success && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        // User not logged in or error - that's fine
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (payload) => {
    setError(null);
    try {
      const data = await loginUser(payload);
      if (data.success) {
        setUser(data.user);
        return data;
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (payload) => {
    setError(null);
    try {
      const data = await registerUser(payload);
      if (data.success) {
        setUser(data.user);
        return data;
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  const adminLogin = async (payload) => {
    setError(null);
    try {
      const data = await loginAdmin(payload);
      if (data.success) {
        setAdmin(data.admin);
        localStorage.setItem('admin', JSON.stringify(data.admin));
        return data;
      } else {
        throw new Error(data.message || 'Admin login failed');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const adminLogout = async () => {
    try {
      await logoutAdmin();
    } catch (err) {
      console.error('Admin logout error:', err);
    } finally {
      setAdmin(null);
      localStorage.removeItem('admin');
    }
  };

  const value = useMemo(
    () => ({
      user,
      admin,
      loading,
      error,
      login,
      register,
      logout,
      adminLogin,
      adminLogout,
      setError
    }),
    [user, admin, loading, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

