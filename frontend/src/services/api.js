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

// User API calls
export const registerUser = (userData) => API.post('/register', userData);
export const loginUser = (userData) => API.post('/login', userData);

// Item management API calls
export const addMenuItem = (itemData) => API.post('/add-item', itemData);

// ✅ Item loading API calls
export const getAllItems = (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.category) params.append('category', filters.category);
  if (filters.trending) params.append('trending', filters.trending);
  if (filters.active !== undefined) params.append('active', filters.active);
  
  return API.get(`/items?${params.toString()}`);
};

export const getItemById = (id) => API.get(`/items/${id}`);

export const getItemsByCategory = (category) => API.get(`/items/category/${category}`);

export const getTrendingItems = () => API.get('/items/trending');

export const searchItems = (query, category = 'all') => {
  const params = new URLSearchParams();
  params.append('q', query);
  if (category !== 'all') params.append('category', category);
  
  return API.get(`/items/search?${params.toString()}`);
};

export default API;