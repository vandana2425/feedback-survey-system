import axios from 'axios';

let navigateRef = null; // Global reference for the navigate function

// Create an instance of axios with the base URL of your backend
const api = axios.create({
  baseURL: 'https://feedback-survey-system.onrender.com', // Replace with your backend URL
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
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add a response interceptor to handle token expiration and logout the user
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        // Token expired or unauthorized, clear token and redirect to login
        localStorage.removeItem('authToken');

        if (navigateRef) {
          navigateRef('/login'); // Redirect to login
        }

        // Optionally, display a message or notification to the user
      }
      return Promise.reject(error);
    }
  );
};

// Function to register a new user
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/users/register', userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Function to log in a user
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/users/login', credentials);
    console.log('loginUser API response:', response);
    return response;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

// Function to create a new form
export const createForm = async (formData) => {
  try {
    const response = await api.post('/forms/create', formData); // Token will be automatically included by interceptor
    return response.data;
  } catch (error) {
    console.error('Error creating form:', error.response?.data || error.message);
    throw error;
  }
};

// Function to get a specific form by ID
export const getFormById = async (formId) => {
  try {
    const response = await api.get(`/forms/${formId}`); // Token will be automatically included by interceptor
    return response.data;
  } catch (error) {
    console.error("Error fetching form by ID:", error);
    throw error;
  }
};

// Example: Fetch Forms with Authorization Header
export const getForms = async () => {
  try {
    const response = await api.get('/forms'); // Token will be automatically included by interceptor
    return response.data;
  } catch (error) {
    console.error('Error fetching forms:', error.response?.data || error.message);
    throw error;
  }
};
