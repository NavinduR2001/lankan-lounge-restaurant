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
  upload
} = require('./controller');

// ✅ Import middleware from existing auth.js
const { authenticateUser, authenticateAdmin } = require('./middleware/auth');

// User routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin-login', loginAdmin);

// Item routes (admin protected)
router.post('/add-item', authenticateAdmin, upload.single('itemImage'), addNewItem);
router.get('/items', loadAllItems);
router.get('/items/trending', loadTrendingItems);
router.get('/items/category/:category', loadItemsByCategory);
router.get('/items/search', searchItems);

// ✅ Admin profile update (protected)
router.put('/admin-profile', authenticateAdmin, updateMainAdmin);

module.exports = router;