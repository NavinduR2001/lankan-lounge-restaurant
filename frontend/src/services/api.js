import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ FIXED: Handle response errors more carefully
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('📡 API Error intercepted:', error.response?.status, error.response?.data);
    
    // ✅ Only redirect to login on specific 401 errors
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message || '';
      
      // ✅ Don't auto-redirect on all 401s - let component handle it
      if (errorMessage.includes('Invalid token') || errorMessage.includes('No token provided')) {
        console.log('🔑 Token invalid, redirecting to login...');
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      // ✅ For other 401s (like wrong password), just pass the error through
    }
    
    return Promise.reject(error);
  }
);

// User API calls
export const registerUser = (userData) => API.post('/register', userData);
export const loginUser = (userData) => API.post('/login', userData);
export const adminLogin = (adminData) => API.post('/admin-login', adminData);

// Item API calls
export const addMenuItem = (itemData) => {
  const formData = new FormData();
  Object.keys(itemData).forEach(key => {
    if (itemData[key] !== null && itemData[key] !== undefined) {
      formData.append(key, itemData[key]);
    }
  });
  
  return API.post('/add-item', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 30000
  });
};

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

// ✅ Enhanced admin profile update with better error handling
export const updateMainAdminProfile = async (profileData) => {
  try {
    console.log('🔄 Updating admin profile with:', profileData);
    const response = await API.put('/admin-profile', profileData);
    console.log('✅ Profile update successful:', response.data);
    return response;
  } catch (error) {
    console.error('❌ Profile update failed:', error.response?.data);
    throw error; // Re-throw so component can handle it
  }
};

export default API;