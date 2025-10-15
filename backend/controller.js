const User = require('./model');
const Item = require('./itemModel');
const Admin = require('./adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require('./utils/generateToken'); // ✅ Use existing utils
const { hashPassword } = require('./utils/hashPassword'); // ✅ Use existing utils if available
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Please upload only image files.'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

// User registration
const registerUser = async (req, res) => {
  const { name, email, city, district, contactNumber, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name, email, city, district, contactNumber,
      password: hashedPassword,
    });

    await newUser.save();
    const token = generateToken(newUser._id); // ✅ Using fixed generateToken

    res.status(201).json({ 
      message: 'User registered successfully', 
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// User login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id); // ✅ Using fixed generateToken
    res.status(200).json({ 
      message: 'Login successful', 
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin login - Only allows main admin role
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Admin login attempt for:', email); // Debug log

    const admin = await Admin.findOne({ 
      email: email.toLowerCase(),
      role: 'admin'
    });
    
    if (!admin) {
      console.log('❌ Admin not found or not admin role'); // Debug log
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!admin.isActive) {
      console.log('❌ Admin account suspended'); // Debug log
      return res.status(401).json({ message: 'Account is suspended' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      console.log('❌ Invalid password'); // Debug log
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    const token = generateToken(admin._id); // ✅ Using fixed generateToken
    console.log('✅ Admin login successful, token generated'); // Debug log
    
    res.json({
      message: 'Admin login successful',
      admin: {
        id: admin._id,
        displayName: admin.displayName,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
        lastLogin: admin.lastLogin
      },
      token
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Add new item
const addNewItem = async (req, res) => {
  const { itemName, itemCategory, foodID, itemPrice, itemDescription, isTrending } = req.body;

  try {
    if (!itemName || !itemCategory || !foodID || !itemPrice || !itemDescription) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Item image is required. Please select an image file.' });
    }

    const existingItem = await Item.findOne({ foodID: foodID.trim() });
    if (existingItem) {
      return res.status(400).json({ message: 'Item with this Food ID already exists' });
    }

    const price = parseFloat(itemPrice);
    if (isNaN(price) || price <= 0) {
      return res.status(400).json({ message: 'Invalid price value' });
    }

    const newItem = new Item({
      itemName: itemName.trim(),
      itemCategory,
      foodID: foodID.trim(),
      itemPrice: price,
      itemDescription: itemDescription.trim(),
      itemImage: req.file.path,
      isTrending: isTrending === 'true' || isTrending === true || false
    });

    await newItem.save();

    res.status(201).json({ 
      message: 'Item added successfully', 
      item: {
        id: newItem._id,
        itemName: newItem.itemName,
        itemCategory: newItem.itemCategory,
        foodID: newItem.foodID,
        itemPrice: newItem.itemPrice,
        itemDescription: newItem.itemDescription,
        itemImage: newItem.itemImage,
        isTrending: newItem.isTrending
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation error', errors: validationErrors });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Item with this Food ID already exists' });
    }

    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
      }
      return res.status(400).json({ message: 'File upload error: ' + error.message });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Load all items
const loadAllItems = async (req, res) => {
  try {
    const { category, trending, active = 'true' } = req.query;
    
    let filter = {};
    if (active === 'true') filter.isActive = true;
    if (category && category !== 'all') filter.itemCategory = category;
    if (trending === 'true') filter.isTrending = true;

    const items = await Item.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ 
      message: 'Items loaded successfully', 
      count: items.length,
      items
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Load items by category
const loadItemsByCategory = async (req, res) => {
  const { category } = req.params;

  try {
    const validCategories = ['sri-lankan', 'indian', 'chinese', 'family-meals', 'desserts', 'bakery', 'pizza', 'beverages'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category', validCategories });
    }

    const items = await Item.find({ itemCategory: category, isActive: true }).sort({ createdAt: -1 });

    res.status(200).json({ 
      message: `Items in ${category} category loaded successfully`, 
      category,
      count: items.length,
      items
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Load trending items
const loadTrendingItems = async (req, res) => {
  try {
    const items = await Item.find({ isTrending: true, isActive: true }).sort({ createdAt: -1 });

    res.status(200).json({ 
      message: 'Trending items loaded successfully', 
      count: items.length,
      items
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Search items
const searchItems = async (req, res) => {
  const { q, category } = req.query;

  try {
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ message: 'Search query must be at least 2 characters long' });
    }

    let filter = {
      isActive: true,
      $or: [
        { itemName: { $regex: q, $options: 'i' } },
        { itemDescription: { $regex: q, $options: 'i' } },
        { foodID: { $regex: q, $options: 'i' } }
      ]
    };

    if (category && category !== 'all') {
      filter.itemCategory = category;
    }

    const items = await Item.find(filter).sort({ createdAt: -1 }).limit(20);

    res.status(200).json({ 
      message: 'Search completed successfully', 
      query: q,
      count: items.length,
      items
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Update main admin profile
const updateMainAdmin = async (req, res) => {
  const { currentPassword, newPassword, displayName, email } = req.body;
  const adminId = req.admin?._id;

  try {
    console.log('📝 Update request received:', {
      adminId: adminId?.toString(),
      hasDisplayName: !!displayName,
      hasEmail: !!email,
      hasCurrentPassword: !!currentPassword,
      hasNewPassword: !!newPassword
    });

    if (!adminId) {
      console.log('❌ No admin ID in request');
      return res.status(401).json({ message: 'Admin ID not found in token' });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      console.log('❌ Admin not found in database');
      return res.status(404).json({ message: 'Admin not found' });
    }

    if (admin.role !== 'admin') {
      console.log('❌ User is not main admin:', admin.role);
      return res.status(403).json({ message: 'Only main admin can update profile' });
    }

    console.log('✅ Admin found:', admin.email, admin.role);

    // Handle password update
    if (newPassword && newPassword.trim()) {
      console.log('🔑 Password change requested');
      
      if (!currentPassword || !currentPassword.trim()) {
        console.log('❌ Current password missing');
        return res.status(400).json({ message: 'Current password is required to change password' });
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
      if (!isCurrentPasswordValid) {
        console.log('❌ Current password incorrect');
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      if (newPassword.length < 6) {
        console.log('❌ New password too short');
        return res.status(400).json({ message: 'New password must be at least 6 characters long' });
      }

      admin.password = await bcrypt.hash(newPassword, 10);
      console.log('✅ Password updated');
    }

    // Handle profile updates
    let profileUpdated = false;

    if (displayName && displayName.trim() && displayName.trim() !== admin.displayName) {
      console.log('📝 Updating display name:', displayName.trim());
      admin.displayName = displayName.trim();
      profileUpdated = true;
    }
    
    if (email && email.trim() && email.toLowerCase().trim() !== admin.email) {
      const emailLower = email.toLowerCase().trim();
      console.log('📧 Updating email:', emailLower);
      
      const existingAdmin = await Admin.findOne({ 
        email: emailLower, 
        _id: { $ne: adminId } 
      });
      
      if (existingAdmin) {
        console.log('❌ Email already exists');
        return res.status(400).json({ message: 'Email is already in use by another admin' });
      }
      
      admin.email = emailLower;
      profileUpdated = true;
    }

    if (profileUpdated || newPassword) {
      await admin.save();
      console.log('✅ Admin profile saved successfully');
    } else {
      console.log('ℹ️  No changes detected, skipping save');
    }

    const responseData = {
      message: 'Admin profile updated successfully',
      admin: {
        id: admin._id,
        email: admin.email,
        displayName: admin.displayName,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    };

    console.log('✅ Sending response:', responseData);
    res.status(200).json(responseData);

  } catch (error) {
    console.error('❌ Update admin error:', error);
    res.status(500).json({ 
      message: 'Server error occurred while updating profile', 
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

module.exports = {
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
};