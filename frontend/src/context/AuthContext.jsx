import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('smart_mess_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('smart_mess_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.success) {
            setUser(res.data);
            localStorage.setItem('smart_mess_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error('Auth verification error:', err);
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.success) {
      localStorage.setItem('smart_mess_token', res.data.token);
      localStorage.setItem('smart_mess_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res.data.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('smart_mess_token');
    localStorage.removeItem('smart_mess_user');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.success) {
        setUser(res.data);
        localStorage.setItem('smart_mess_user', JSON.stringify(res.data));
      }
    } catch (err) {
      console.error('Failed to refresh user profile:', err);
    }
  };

  const register = async (formData) => {

    const res = await api.post('/auth/register', formData);
    if (res.success) {
      localStorage.setItem('smart_mess_token', res.data.token);
      localStorage.setItem('smart_mess_user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      return res;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
