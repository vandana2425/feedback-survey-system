import axios from 'axios';

let navigateRef = null; // Global reference for the navigate function

// Create an instance of axios with the base URL from environment variables
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Function to setup Axios interceptors with navigate function
export const setupAxiosInterceptors = (navigate) => {
  navigateRef = navigate; // Store the navigate function globally

  // Add a request interceptor to include the Authorization token in all requests
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add a response interceptor to handle token expiration and logout the user
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        console.error('Token expired or unauthorized access');
        logout(); // Clear auth data and redirect to login
        if (navigateRef) {
          navigateRef('/login');
        } else {
          window.location.href = '/login'; // Redirect if navigation is not available
        }
      }
      return Promise.reject(error);
    }
  );
};

// Function to register a new user
export const register = async (userData) => {
  try {
    const response = await api.post('/users/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);
    throw error;
  }
};

// Function to log in a user
export const login = async (credentials) => {
  try {
    const response = await api.post('/users/login', credentials);
    const { token, user } = response.data;
    if (token) {
      localStorage.setItem('authToken', token); // Store token
      localStorage.setItem('authUser', JSON.stringify(user)); // Store user info
    }
    return { token, user };
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    throw error;
  }
};

// Function to log out the user
export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
  window.location.href = '/';
  console.log('User logged out successfully.');
};

// Function to check if the user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  const user = getCurrentUser();
  return !!token && !!user;
};

// Get the currently logged-in user from localStorage
export const getCurrentUser = () => {
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

// Function to get a specific form by ID
export const getFormById = async (formId) => {
  try {
    const response = await api.get(`/forms/${formId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching form by ID:', error.response?.data || error.message);
    throw error;
  }
};

// Function to create a new form
export const createForm = async (formData) => {
  try {
    const response = await api.post('/forms/create', formData);
    return response.data;
  } catch (error) {
    console.error('Error creating form:', error.response?.data || error.message);
    throw error;
  }
};

// Function to get all forms
export const getForms = async () => {
  try {
    const response = await api.get('/forms');
    return response.data;
  } catch (error) {
    console.error('Error fetching forms:', error.response?.data || error.message);
    throw error;
  }
};

// Function to fetch dashboard data using JWT token
export const getDashboard = async () => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('User is not authenticated');
  }

  try {
    const response = await api.get('/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error.response?.data || error.message);
    throw error;
  }
};

// Helper function to handle errors globally
export const handleErrors = (error) => {
  console.error('Error:', error.response?.data || error.message);
  if (error.response && error.response.status === 401) {
    console.error('Token expired or unauthorized access. Logging out...');
    logout(); // Logout if unauthorized or token is invalid
  }
};

export const getToken = () => {
  return localStorage.getItem('authToken');
};

export const refreshToken = async () => {
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


export const authService = {
  setupAxiosInterceptors,
  register,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
  createForm,
  getFormById,
  getForms,
  getDashboard,
  handleErrors,
  getToken,
  refreshToken,
};

export default authService;
