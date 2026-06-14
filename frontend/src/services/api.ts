import axios from 'axios';

// Creating a unified server instance pointing to our base URL schema
export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically injects JWT storage tokens on protected calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('stylora_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);