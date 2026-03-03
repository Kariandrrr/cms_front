import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../api/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setAuthenticated(true);
      } catch (e) {
        console.error('Ошибка парсинга user:', e);
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken, userData, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("token", newToken);
    storage.setItem("user", JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    setAuthenticated(true);
  };

  const logout = () => {
    if (authAPI?.logout) authAPI.logout();
    setUser(null);
    setToken(null);
    setAuthenticated(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  };

  const updateUserData = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    if (localStorage.getItem("user")) {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
    if (sessionStorage.getItem("user")) {
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const value = {
    user, token, loading, isAuthenticated, login, logout, updateUserData,
    hasRole: (roles) => {
      if (!user?.role) return false;
      return Array.isArray(roles) ? roles.includes(user.role) : user.role === roles;
    }
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};