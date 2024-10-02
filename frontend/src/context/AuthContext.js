import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService'; // Import the authService for handling login, logout, etc.

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to log in
  const login = async (email, password) => {
    console.log('AuthContext login called with:', email, password);
    try {
      setError(null);
      const { token, user } = await authService.login(email, password);

      // Store token and user in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(user));

      // Update auth state
      setAuth({ token, user });
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  // Function to log out
  const logout = () => {
    console.log('Logging out');
    authService.logout(); // Clear user data using authService

    // Clear token and user from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');

    setAuth(null);
  };

  useEffect(() => {
    // Retrieve token and user from localStorage on initial load
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('authUser'));

    if (token && user) {
      setAuth({ token, user });
    } else {
      setAuth(null);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
