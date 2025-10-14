const express = require('express');
const router = express.Router();
const { 
    registerUser, 
    loginUser,
    loginAdmin,
    addNewItem,
    loadItemById,
    loadAllItems,
    loadItemsByCategory,
    loadTrendingItems,
    searchItems,
    getAllAdmins,      // ✅ Add these imports
    createSubAdmin,    
    updateAdmin,       
    deleteAdmin,       
    updateMainAdmin,   
    upload // ✅ Add upload middleware
} = require('./controller');

// User routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin authentication
router.post('/admin-login', loginAdmin);

// ✅ Admin management routes
router.get('/admins', getAllAdmins);                    // Get all sub-admins
router.post('/admins', createSubAdmin);                 // Create new admin/manager/employee
router.put('/admins/:id', updateAdmin);                 // Update admin details
router.delete('/admins/:id', deleteAdmin);              // Delete admin
router.put('/admin-profile', updateMainAdmin);          // Update main admin profile

// Item routes
router.post('/add-item', upload.single('itemImage'), addNewItem);
router.get('/items', loadAllItems);                    // Get all items with optional filters
router.get('/items/trending', loadTrendingItems);      // Get trending items only
router.get('/items/category/:category', loadItemsByCategory); // Get items by category
router.get('/items/search', searchItems);             // Search items
router.get('/items/:id', loadItemById);    
          // Get single item by ID

// ✅ Add this debug route to see admin data
router.get('/debug-admins', async (req, res) => {
  try {
    const Admin = require('./adminModel');
    const admins = await Admin.find({});
    res.json({
      count: admins.length,
      admins: admins.map(admin => ({
        id: admin._id,
        email: admin.email,
        displayName: admin.displayName,
        role: admin.role,
        isActive: admin.isActive,
        hasPassword: !!admin.password,
        passwordLength: admin.password ? admin.password.length : 0,
        createdAt: admin.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;