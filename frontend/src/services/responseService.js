import axios from 'axios';
import authService from './authService'; // Assuming you have an authService to handle token refresh

const api = axios.create({
  baseURL: 'https://feedback-survey-system.onrender.com', // Replace with your backend URL
});

// Interceptor to handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true; // Flag to prevent infinite retry loops
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const newToken = await authService.refreshToken(refreshToken); // Assuming refreshToken function exists
          localStorage.setItem('authToken', newToken); // Save new token

          // Retry the original request with new token
          error.config.headers['Authorization'] = `Bearer ${newToken}`;
          return api.request(error.config);
        } else {
          // If no refresh token, log out the user
          authService.logout();
          window.location.href = '/login';
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

const responseService = {
  // 1. Submit a response to a form (Public submission, No Authentication)
  async submitResponse(formId, responses) {
    try {
      const response = await api.post('/responses/submit', { formId, responses });
      console.log('Response submitted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error submitting response:', error.response?.data || error.message);
      throw new Error(`Failed to submit response: ${error.response?.data?.message || error.message}`);
    }
  },


  // 2. Fetch all responses for a specific form (Optional Authentication)
  async getResponses(formId, token = null, page = 1, limit = 10) {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await api.get(`/responses/form/${formId}`, {
        headers,
        params: {
          page,
          limit,
        },
      });

      console.log('Responses fetched successfully:', response.data.docs || response.data);
      return response.data.docs || response.data; // Return docs if pagination is in place
    } catch (error) {
      console.error('Error fetching responses:', error.response?.data || error.message);
      throw new Error(`Failed to fetch responses: ${error.response?.data?.message || error.message}`);
    }
  },

  // 3. Update an existing response (Requires Authentication)
  async updateResponse(responseId, updatedResponses, token) {
    if (!token) {
      throw new Error('Authorization token is required.');
    }
    try {
      const response = await api.put(
        `/responses/update/${responseId}`,
        { responses: updatedResponses }, // Send the updated responses
        {
          headers: {
            Authorization: `Bearer ${token}`, // JWT token for authentication
          },
        }
      );
      console.log('Response updated successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating response:', error.response?.data || error.message);
      throw new Error(`Failed to update response: ${error.response?.data?.message || error.message}`);
    }
  },

  // 4. Delete a specific response (Requires Authentication)
  async deleteResponse(responseId, token) {
    if (!token) {
      throw new Error('Authorization token is required.');
    }
    try {
      const response = await api.delete(`/responses/delete/${responseId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // JWT token for authentication
        },
      });
      console.log('Response deleted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error deleting response:', error.response?.data || error.message);
      throw new Error(`Failed to delete response: ${error.response?.data?.message || error.message}`);
    }
  },

  // 5. Fetch responses for a specific form by a specific user (Requires Authentication)
  async getUserResponses(formId, userId, token) {
    if (!token) {
      throw new Error('Authorization token is required.');
    }
    try {
      const response = await api.get(`/responses/user/${userId}/form/${formId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // JWT token for authentication
        },
      });
      console.log('User responses fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching user responses:', error.response?.data || error.message);
      throw new Error(`Failed to fetch user responses: ${error.response?.data?.message || error.message}`);
    }
  },
};

export default responseService;
