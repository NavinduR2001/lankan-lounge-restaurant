const express = require('express');
const router = express.Router();
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
  moveOrderToHistory,      // ✅ New import
  getOrderHistory,         // ✅ New import
  getOrderHistoryStats     // ✅ New import
} = require('./controller');

// ✅ Import middleware from existing auth.js
const { authenticateUser, authenticateAdmin } = require('./middleware/auth');

// User routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin-login', loginAdmin);

// ✅ Cart routes (user protected)
router.get('/cart', authenticateUser, getUserCart);
router.put('/cart', authenticateUser, updateUserCart);

// Item routes (admin protected)
router.post('/add-item', authenticateAdmin, upload.single('itemImage'), addNewItem);
router.get('/items', loadAllItems);
router.get('/items/trending', loadTrendingItems);
router.get('/items/category/:category', loadItemsByCategory);
router.get('/items/search', searchItems);

// ✅ Admin profile update (protected)
router.put('/admin-profile', authenticateAdmin, updateMainAdmin);

// ✅ Order routes
router.post('/orders', authenticateUser, createOrder); // ✅ Added authenticateUser
router.get('/orders', authenticateAdmin, getAllOrders);
router.get('/orders/user', authenticateUser, getUserOrders);
router.put('/orders/:orderId/status', authenticateAdmin, updateOrderStatus);
router.delete('/orders/:orderId', authenticateAdmin, deleteOrder); // ✅ New route for deleting orders

// Order History routes
router.post('/orders/:orderId/move-to-history', authenticateAdmin, moveOrderToHistory);
router.get('/order-history', authenticateAdmin, getOrderHistory);
router.get('/order-history/stats', authenticateAdmin, getOrderHistoryStats);

module.exports = router;