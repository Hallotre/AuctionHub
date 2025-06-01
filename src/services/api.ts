import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { ApiError } from '../types/api';

// Base URL for the Noroff API - use environment variable or fallback
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://v2.api.noroff.dev';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    const apiKey = localStorage.getItem('apiKey');
    
    // Add token for authenticated requests
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add API key for all requests
    if (apiKey) {
      config.headers['X-Noroff-API-Key'] = apiKey;
    }

    // Add environment variables if available
    if (!token && import.meta.env.VITE_BEARER_TOKEN) {
      config.headers.Authorization = `Bearer ${import.meta.env.VITE_BEARER_TOKEN}`;
    }

    if (!apiKey && import.meta.env.VITE_API_KEY) {
      config.headers['X-Noroff-API-Key'] = import.meta.env.VITE_API_KEY;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common API errors
    if (error.response) {
      const apiError: ApiError = {
        errors: error.response.data?.errors || [{ message: error.response.data?.message || 'An error occurred' }],
        status: error.response.data?.status || 'error',
        statusCode: error.response.status
      };
      return Promise.reject(apiError);
    }
    
    // Network or other errors
    const networkError: ApiError = {
      errors: [{ message: 'Network error. Please check your connection.' }],
      status: 'error',
      statusCode: 0
    };
    return Promise.reject(networkError);
  }
);

export default api; 