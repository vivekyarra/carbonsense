/**
 * @file Axios instance configured with base URL and interceptors.
 */

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true // send cookies
});

let inMemoryToken = null;

/**
 *
 * @param token
 */
export const setToken = (token) => {
  inMemoryToken = token;
};

/**
 *
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
        const res = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/refresh`, {}, {
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
