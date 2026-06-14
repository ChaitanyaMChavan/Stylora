import axios from 'axios';

// Configuration instance targeting your local backend development server
export const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Duplicate alias to prevent any case-sensitivity import bugs (api vs API)
export const api = API;

// Request interceptor to automatically inject authorization headers if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('stylora_auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Keep default export intact just in case other files use it
export default API;