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

// Cart API calls
export const getUserCart = () => API.get('/cart');
export const updateUserCart = (cartItems) => API.put('/cart', { cartItems });

// Item API calls
export const addMenuItem = (formData) => {
  console.log('📡 Adding menu item with FormData');
  return API.post('/add-item', formData, {
    headers: {
      'Content-Type': 'multipart/form-data', // ✅ Important for file uploads
    },
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

export const deleteItem = (itemId) => {
  console.log('📡 Deleting item with ID:', itemId);
  return API.delete(`/items/${itemId}`);
}

export const searchItems = (query, category = 'all') => {
  const params = new URLSearchParams();
  params.append('q', query);
  if (category !== 'all') params.append('category', category);
  return API.get(`/items/search?${params.toString()}`);
};

// ✅ Enhanced admin profile update with better error handling
export const updateMainAdminProfile = (profileData) => {
  console.log('🔄 Updating admin profile with:', profileData);
  return API.put('/admin-profile', profileData)
    .then(response => {
      console.log('✅ Profile updated successfully:', response.data);
      return response;
    })
    .catch(error => {
      console.log('❌ Profile update failed:', error.response?.data);
      throw error;
    });
};

// Order API calls
export const createOrder = (orderData) => API.post('/orders', orderData);
export const getAllOrders = () => API.get('/orders');
export const updateOrderStatus = (orderId, status) => API.put(`/orders/${orderId}`, { status });
export const deleteOrder = (orderId) => API.delete(`/orders/${orderId}`);

// Order History API calls
export const moveOrderToHistory = (orderId) => API.post(`/orders/${orderId}/move-to-history`);
export const getOrderHistory = (params = {}) => {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.append('page', params.page);
  if (params.limit) searchParams.append('limit', params.limit);
  if (params.status) searchParams.append('status', params.status);
  if (params.startDate) searchParams.append('startDate', params.startDate);
  if (params.endDate) searchParams.append('endDate', params.endDate);
  
  return API.get(`/order-history?${searchParams.toString()}`);
};
export const getOrderHistoryStats = (params = {}) => {
  const searchParams = new URLSearchParams();
  if (params.startDate) searchParams.append('startDate', params.startDate);
  if (params.endDate) searchParams.append('endDate', params.endDate);
  
  return API.get(`/order-history/stats?${searchParams.toString()}`);
};

export default API;