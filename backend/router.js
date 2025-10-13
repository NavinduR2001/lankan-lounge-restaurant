const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    addNewItem,
    loadItemById,
    loadAllItems,
    loadItemsByCategory,
    loadTrendingItems,
    searchItems
} = require('./controller');

// User routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Item management routes
router.post('/add-item', addNewItem);

// ✅ Item loading routes
router.get('/items', loadAllItems);                    // Get all items with optional filters
router.get('/items/trending', loadTrendingItems);      // Get trending items only
router.get('/items/category/:category', loadItemsByCategory); // Get items by category
router.get('/items/search', searchItems);             // Search items
router.get('/items/:id', loadItemById);               // Get single item by ID

module.exports = router;