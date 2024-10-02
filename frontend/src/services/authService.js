import axios from 'axios';

// Replace with your actual backend API URL
const API_URL = 'http://localhost:5001/api';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the Authorization token in all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration and auto-logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error('Token expired or unauthorized access');
      authService.logout();  // Clear auth data
      window.location.href = '/'; // Redirect to login
    }
    return Promise.reject(error);
  }
);

// Register a new user
const register = async (email, password) => {
  try {
    const response = await api.post('/users/register', { email, password });
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error;
  }
};

// Log in an existing user
const login = async (email, password) => {
  try {
    const response = await api.post('/users/login', { email, password });
    const { token, user } = response.data;

    if (token) {
      // Store token and user details in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('authUser', JSON.stringify(user));
    }

    return { token, user };
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

// Log out the user by clearing stored data
const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('authUser');
  window.location.href = '/';
  console.log('User logged out successfully.');
};

// Get the token from localStorage
const getToken = () => {
  return localStorage.getItem('authToken');
};

// Get the currently logged-in user from localStorage
const getCurrentUser = () => {
  const user = localStorage.getItem('authUser');
  if (user && user !== 'undefined') {
    try {
      return JSON.parse(user);
    } catch (error) {
      console.error('Error parsing authUser:', error);
      return null;
    }
  }
  return null;
};

// Check if the user is authenticated by checking the presence of user data
const isAuthenticated = () => {
  const user = getCurrentUser();
  return !!user && !!getToken(); // Check if token and user exist
};

// Fetch the dashboard data using the JWT token
const getDashboard = async () => {
  const token = getToken();
  if (!token) {
    throw new Error('User is not authenticated');
  }

  try {
    const response = await api.get('/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error.response?.data || error.message);
    throw error;
  }
};

// Optionally, you can add a method for refreshing tokens if your backend supports it
const refreshToken = async () => {
  const token = getToken();
  if (!token) {
    throw new Error('User is not authenticated');
  }

  try {
    const response = await api.post('/refresh-token', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token); // Update the token in localStorage
    }

    return response.data;
  } catch (error) {
    console.error('Error refreshing token:', error.response?.data || error.message);
    throw error;
  }
};

// Helper function to handle errors globally
const handleErrors = (error) => {
  console.error('Error:', error.response?.data || error.message);
  if (error.response && error.response.status === 401) {
    console.error('Token expired or unauthorized access. Logging out...');
    logout(); // Logout if unauthorized or token is invalid
  }
};

// Export the auth service methods
const authService = {
  register,
  login,
  getToken,
  logout,
  getCurrentUser,
  isAuthenticated,
  getDashboard,
  refreshToken,
  handleErrors,
};

export default authService;
