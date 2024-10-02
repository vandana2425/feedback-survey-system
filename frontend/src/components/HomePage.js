import React, { useState, useEffect } from 'react';
import Dashboard from './DashboardPage'; // Adjust path if needed
import LandingPage from './LandingPage'; // Adjust path if needed
import { jwtDecode } from 'jwt-decode'; // Correct import using default export
import auth from '../services/authService';

function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Default to false
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Check authentication status
    const token = auth.getToken(); // Assuming you have a method to get the token from localStorage
    console.log("Token found: ", token); // Debugging

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded token: ", decoded); // Debugging

        const isTokenValid = decoded.exp * 1000 > Date.now(); // Check if token is still valid
        console.log("Is token valid? ", isTokenValid); // Debugging

        setIsAuthenticated(isTokenValid);
      } catch (error) {
        console.error('Error decoding token:', error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    setIsLoading(false); // After checking auth status, stop loading
  }, []);

  if (isLoading) {
    // Render loading state while checking authentication
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Dashboard /> : <LandingPage />;
}

export default HomePage;
