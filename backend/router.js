const express = require('express');
const router = express.Router();
const { authenticateUser, authenticateAdmin } = require('./middleware/auth');

const { 
  registerUser, 
  loginUser,
  loginAdmin,
  addNewItem,
  loadAllItems,
  loadItemsByCategory,
  loadTrendingItems,
  searchItems,
  updateMainAdmin,
  upload,
  getUserCart,
  updateUserCart,
  createOrder, 
  getAllOrders, 
  updateOrderStatus,
  getUserOrders,
  deleteOrder,
  moveOrderToHistory,
  getOrderHistory,
  getOrderHistoryStats,
  deleteItem
} = require('./controller');

// User routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin-login', loginAdmin);

// Item routes
router.post('/add-item', authenticateAdmin, upload.single('image'), addNewItem);
router.get('/items', loadAllItems);
router.get('/items/category/:category', loadItemsByCategory);
router.get('/items/trending', loadTrendingItems);
router.get('/items/search', searchItems);
router.delete('/items/:itemId', authenticateAdmin, deleteItem); // ✅ ADD THIS

// Cart routes
router.get('/cart', authenticateUser, getUserCart);
router.put('/cart', authenticateUser, updateUserCart);          // ✅ ADD THIS

// Admin routes
router.put('/admin/update', authenticateAdmin, updateMainAdmin);   // ✅ Current route
router.put('/admin-profile', authenticateAdmin, updateMainAdmin);  // ✅ ADD THIS (what frontend expects)

// Order routes
router.post('/orders', authenticateUser, createOrder);
router.get('/orders', authenticateAdmin, getAllOrders);
router.get('/orders/user', authenticateUser, getUserOrders);

// Order management routes
router.put('/orders/:orderId', authenticateAdmin, updateOrderStatus);           // ✅ ADD THIS
router.delete('/orders/:orderId', authenticateAdmin, deleteOrder);              // ✅ ADD THIS
router.post('/orders/:orderId/move-to-history', authenticateAdmin, moveOrderToHistory); // ✅ ADD THIS

// Order History routes
router.get('/order-history', authenticateAdmin, getOrderHistory);
router.get('/order-history/stats', authenticateAdmin, getOrderHistoryStats);

module.exports = router;