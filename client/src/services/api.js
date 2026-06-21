/**
 * @file Axios instance configured with base URL and interceptors.
 */

import axios from 'axios';

/** @constant {string} DEFAULT_API_URL - Default API base URL used when VITE_API_URL is not set. */
const DEFAULT_API_URL = 'https://carbonsense-api-806649223406.us-central1.run.app/api';

const apiBaseUrl = import.meta.env.VITE_API_URL || DEFAULT_API_URL;

// Validate API URL format at startup
if (apiBaseUrl && !/^https?:\/\/.+/i.test(apiBaseUrl)) {
  console.error(`[api] Invalid API URL format: "${apiBaseUrl}". Expected a URL starting with http:// or https://`);
}

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true // send cookies
});

let inMemoryToken = null;

/**
 * @description Stores the JWT access token in memory.
 * @param {string|null} token - The JWT token to store, or null to clear.
 */
export const setToken = (token) => {
  inMemoryToken = token;
};

/**
 * @description Retrieves the current JWT access token from memory.
 * @returns {string|null} The current JWT token, or null if not set.
 */
export const getToken = () => inMemoryToken;

// Add a request interceptor to attach the JWT token
api.interceptors.request.use(
  (config) => {
    if (inMemoryToken) {
      config.headers.Authorization = `Bearer ${inMemoryToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't already tried refreshing
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh the token using the httpOnly cookie
        const res = await axios.post(`${apiBaseUrl}/auth/refresh`, {}, {
          withCredentials: true
        });
        
        if (res.data.accessToken) {
          // Save new token
          setToken(res.data.accessToken);
          // Update authorization header
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          // Retry original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear everything and force logout
        setToken(null);
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
