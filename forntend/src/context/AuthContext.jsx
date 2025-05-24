import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, getProfile } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('access_token');
      if (token) {
        try {
          const userData = await getProfile();
          setUser(userData);
        } catch (error) {
          console.error('Failed to load user profile:', error);
          try {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          } catch (storageError) {
            console.error('Failed to remove tokens from localStorage:', storageError);
          }
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const signIn = async (username, password) => {
    try {
      const { access, refresh, user } = await login(username, password);
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      setUser(user);
      navigate('/profile');
    } catch (error) {
      console.error('Login failed:', error);
      throw error; // Let caller handle error if needed
    }
  };

  const signOut = () => {
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } catch (storageError) {
      console.error('Failed to remove tokens from localStorage:', storageError);
    }
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
