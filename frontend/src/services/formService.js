import axios from 'axios';
import authService from './authService'; // Import authService for token refresh and logout functionality

// Create an instance of axios with the base URL of your backend
const api = axios.create({
  baseURL: 'https://feedback-survey-system.onrender.com', // Replace with your backend URL
});

// Add a response interceptor to handle token expiration and auto-refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error('Token expired or unauthorized. Attempting to refresh the token...');
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const newToken = await authService.refreshToken(refreshToken);
          localStorage.setItem('authToken', newToken);

          // Update the original request's Authorization header with the new token
          error.config.headers['Authorization'] = `Bearer ${newToken}`;
          return api.request(error.config); // Retry the original request with the new token
        } else {
          console.error('No refresh token available. Logging out.');
          authService.logout();
          window.location.href = '/login'; // Redirect to login
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        authService.logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const formService = {
  // Fetch all forms
  async getForms() {
    try {
      const response = await api.get('/forms'); // API route for fetching all forms
      return response.data;
    } catch (error) {
      console.error('Error fetching forms:', error);
      throw new Error('Error fetching forms.');
    }
  },

  // Fetch a specific form by ID
  async getForm(formId) {
    try {
      const response = await api.get(`/forms/${formId}`); // API route for fetching a specific form
      return response.data;
    } catch (error) {
      console.error('Error fetching form:', error);
      throw new Error('Error fetching form.');
    }
  },

  // Fetch all forms for a specific user
  async getAllForms(token) {
    try {
      const response = await api.get('/forms/user', {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure token is always passed
        },
      });
      console.log('All forms fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      handleUnauthorizedError(error);  // Handle token expiration or other unauthorized issues
      throw error;
    }
  },

  // Create a new form
  async createForm(data, token) {
    try {
      const response = await api.post('/forms/create', data, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure the right content type
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Form created successfully:', response.data);
      return response.data;
    } catch (error) {
      handleUnauthorizedError(error);  // Handle unauthorized access
      throw error;
    }
  },

  // Update a form
  async updateForm(formId, formData, token) {
    try {
      const updatedData = {
        ...formData,
        fields: JSON.stringify(formData.fields.map((field) => ({
          ...field,
          options: field.options ? field.options.map((opt) => ({ label: opt.label, value: opt.value })) : [],  // Serialize options for each field
        }))),
      };

      const response = await api.put(`/forms/${formId}`, updatedData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Form updated successfully:', response.data);
      return response.data;
    } catch (error) {
      handleUnauthorizedError(error);  // Handle token expiration or unauthorized access
      throw error;
    }
  },

  // Submit a response to a form
  async submitResponse(data) {
    try {
      const response = await api.post('/forms/response', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Response submitted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error submitting response:', error.response?.data || error.message);
      throw error;
    }
  },

  // Fetch responses for a specific form
  async getFormResponses(formId, token = null) {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await api.get(`/forms/response/${formId}`, { headers });
      console.log('Form responses fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      handleUnauthorizedError(error);  // Handle token expiration or unauthorized access
      throw error;
    }
  },

  // Delete a form by ID
  async deleteForm(formId, token) {
    try {
      const response = await api.delete(`/forms/${formId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Form deleted successfully:', response.data);
      return response.data;
    } catch (error) {
      handleUnauthorizedError(error);  // Handle token expiration or unauthorized access
      throw error;
    }
  },
};

// Helper function to handle token expiration or unauthorized access
function handleUnauthorizedError(error) {
  if (error.response?.status === 401) {
    console.error('Token expired or unauthorized. Logging out...');
    authService.logout();  // Log out the user
    window.location.href = '/login';  // Redirect to login page
  } else {
    console.error('Error occurred:', error.response?.data || error.message);
  }
}

export default formService;
