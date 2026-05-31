// context/AuthContext.js — Global auth state with React Context
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set axios base URL
  axios.defaults.baseURL = '/api';

  // On mount — restore user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('olcrp_user');
    if (stored) {
      const userData = JSON.parse(stored);
      setUser(userData);
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post('/auth/login', { email, password });
    const userData = data.data;
    setUser(userData);
    localStorage.setItem('olcrp_user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    toast.success(`Welcome back, ${userData.name}!`);
    return userData;
  };

  const register = async (formData) => {
    const { data } = await axios.post('/auth/register', formData);
    const userData = data.data;
    setUser(userData);
    localStorage.setItem('olcrp_user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    toast.success(`Welcome to LearnHub, ${userData.name}!`);
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('olcrp_user');
    delete axios.defaults.headers.common['Authorization'];
    toast.info('Logged out successfully');
  };

  const updateUser = (updatedData) => {
    const merged = { ...user, ...updatedData };
    setUser(merged);
    localStorage.setItem('olcrp_user', JSON.stringify(merged));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};