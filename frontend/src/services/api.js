import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API calls
export const registerUser = (userData) => API.post('/register', userData);
export const loginUser = (userData) => API.post('/login', userData);

export default API;