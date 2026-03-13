import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await api.post('/auth/me');
          if (res.data && res.data.success && res.data.user) {
            setUser({ ...res.data.user, token });
          } else {
            localStorage.removeItem('token');
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, user: userData } = response.data;
    localStorage.setItem('token', token);
    
    // As the backend login doesn't return full user object in the current implementation, we fetch it
    const userRes = await api.post('/auth/me', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    setUser({ ...userRes.data.user, token });
    return response.data;
  };

  const register = async (name, email, password, mobile = '1234567890', isAdmin = false) => {
    const response = await api.post('/auth/register', { name, email, password, mobile, isAdmin });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-dark-900 text-white">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
