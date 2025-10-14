const User = require('./model');
const Item = require('./itemModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require('./utils/generateToken');
const hashPassword = require('./utils/hashPassword');
const multer = require('multer');
const path = require('path');
const Admin = require('./adminModel');

// ✅ Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Please upload only image files.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Register a new user
const registerUser = async (req, res) => {
    console.log('Registration request received:', req.body);
    
    const { name, email, city, district, contactNumber, password } = req.body;

    try {
        // Check if the user already exists
        console.log('Checking if user exists with email:', email);
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            console.log('User already exists');
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        console.log('Creating new user...');
        const newUser = new User({
            name,
            email,
            city,
            district,
            contactNumber,
            password: hashedPassword,
        });

        // Save the user to the database
        console.log('Saving user to database...');
        await newUser.save();
        console.log('User saved successfully');

        // Generate a token
        console.log('Generating token...');
        const token = generateToken(newUser._id);
        console.log('Token generated successfully');

        res.status(201).json({ 
            message: 'User registered successfully', 
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error('Registration error details:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Login a user
const loginUser = async (req, res) => {
    console.log('Login request received:', req.body);
    
    const { email, password } = req.body;

    try {
        // Find the user by email
        console.log('Finding user with email:', email);
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the password with the hashed password
        console.log('Comparing passwords...');
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password does not match');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a token
        console.log('Generating login token...');
        const token = generateToken(user._id);

        res.status(200).json({ 
            message: 'Login successful', 
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error details:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// ✅ Updated addNewItem function
const addNewItem = async (req, res) => {
    console.log('Add item request received:', req.body);
    console.log('File received:', req.file);
    
    const { itemName, itemCategory, foodID, itemPrice, itemDescription, isTrending } = req.body;

    try {
        // ✅ Validate required fields
        if (!itemName || !itemCategory || !foodID || !itemPrice || !itemDescription) {
            return res.status(400).json({ 
                message: 'All fields are required',
                missing: {
                    itemName: !itemName,
                    itemCategory: !itemCategory,
                    foodID: !foodID,
                    itemPrice: !itemPrice,
                    itemDescription: !itemDescription
                }
            });
        }

        // ✅ Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({ 
                message: 'Item image is required' 
            });
        }

        // Check if item with same foodID already exists
        const existingItem = await Item.findOne({ foodID: foodID.trim() });
        if (existingItem) {
            return res.status(400).json({ message: 'Item with this Food ID already exists' });
        }

        // Get image path from uploaded file
        const itemImage = req.file.path;

        // ✅ Validate price
        const price = parseFloat(itemPrice);
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ message: 'Invalid price value' });
        }

        // Create a new item
        const newItem = new Item({
            itemName: itemName.trim(),
            itemCategory,
            foodID: foodID.trim(),
            itemPrice: price,
            itemDescription: itemDescription.trim(),
            itemImage, // This will be the file path
            isTrending: isTrending === 'true' || isTrending === true || false
        });

        // Save the item to the database
        await newItem.save();
        console.log('Item saved successfully:', newItem);

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
                isTrending: newItem.isTrending,
                createdAt: newItem.createdAt
            }
        });
    } catch (error) {
        console.error('Error adding item:', error);
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                message: 'Validation error', 
                errors: validationErrors 
            });
        }
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({ 
                message: 'Item with this Food ID already exists' 
            });
        }

        // ✅ Handle multer errors
        if (error instanceof multer.MulterError) {
            if (error.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
            }
            return res.status(400).json({ message: 'File upload error: ' + error.message });
        }
        
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

// ✅ Load single item by ID
const loadItemById = async (req, res) => {
    console.log('Load item by ID request received:', req.params);
    const { id } = req.params;

    try {
        const item = await Item.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ 
            message: 'Item loaded successfully', 
            item: {
                id: item._id,
                itemName: item.itemName,
                itemCategory: item.itemCategory,
                foodID: item.foodID,
                itemPrice: item.itemPrice,
                itemDescription: item.itemDescription,
                itemImage: item.itemImage,
                isTrending: item.isTrending,
                isActive: item.isActive,
                createdAt: item.createdAt
            }
        });
    } catch (error) {
        console.error('Error loading item:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

// ✅ Load all items for menu
const loadAllItems = async (req, res) => {
    console.log('Load all items request received');

    try {
        // Get query parameters for filtering
        const { category, trending, active = 'true' } = req.query;
        
        // Build filter object
        let filter = {};
        
        // Only show active items by default
        if (active === 'true') {
            filter.isActive = true;
        }
        
        // Filter by category if specified
        if (category && category !== 'all') {
            filter.itemCategory = category;
        }
        
        // Filter by trending if specified
        if (trending === 'true') {
            filter.isTrending = true;
        }

        console.log('Applied filters:', filter);

        // Find items with filters, sort by creation date (newest first)
        const items = await Item.find(filter)
            .sort({ createdAt: -1 })
            .select('-__v'); // Exclude version field

        console.log(`Found ${items.length} items`);

        res.status(200).json({ 
            message: 'Items loaded successfully', 
            count: items.length,
            items: items.map(item => ({
                id: item._id,
                itemName: item.itemName,
                itemCategory: item.itemCategory,
                foodID: item.foodID,
                itemPrice: item.itemPrice,
                itemDescription: item.itemDescription,
                itemImage: item.itemImage,
                isTrending: item.isTrending,
                isActive: item.isActive,
                createdAt: item.createdAt
            }))
        });
    } catch (error) {
        console.error('Error loading items:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

// ✅ Load items by category
const loadItemsByCategory = async (req, res) => {
    console.log('Load items by category request received:', req.params);
    const { category } = req.params;

    try {
        // Validate category
        const validCategories = ['sri-lankan', 'indian', 'chinese', 'family-meals', 'desserts', 'bakery', 'pizza', 'beverages'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ 
                message: 'Invalid category',
                validCategories 
            });
        }

        const items = await Item.find({ 
            itemCategory: category, 
            isActive: true 
        }).sort({ createdAt: -1 });

        console.log(`Found ${items.length} items in category: ${category}`);

        res.status(200).json({ 
            message: `Items in ${category} category loaded successfully`, 
            category,
            count: items.length,
            items: items.map(item => ({
                id: item._id,
                itemName: item.itemName,
                itemCategory: item.itemCategory,
                foodID: item.foodID,
                itemPrice: item.itemPrice,
                itemDescription: item.itemDescription,
                itemImage: item.itemImage,
                isTrending: item.isTrending,
                createdAt: item.createdAt
            }))
        });
    } catch (error) {
        console.error('Error loading items by category:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

// ✅ Load trending items only
const loadTrendingItems = async (req, res) => {
    console.log('Load trending items request received');

    try {
        const items = await Item.find({ 
            isTrending: true, 
            isActive: true 
        }).sort({ createdAt: -1 });

        console.log(`Found ${items.length} trending items`);

        res.status(200).json({ 
            message: 'Trending items loaded successfully', 
            count: items.length,
            items: items.map(item => ({
                id: item._id,
                itemName: item.itemName,
                itemCategory: item.itemCategory,
                foodID: item.foodID,
                itemPrice: item.itemPrice,
                itemDescription: item.itemDescription,
                itemImage: item.itemImage,
                isTrending: item.isTrending,
                createdAt: item.createdAt
            }))
        });
    } catch (error) {
        console.error('Error loading trending items:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

// ✅ Search items by name
const searchItems = async (req, res) => {
    console.log('Search items request received:', req.query);
    const { q, category } = req.query;

    try {
        if (!q || q.trim().length < 2) {
            return res.status(400).json({ 
                message: 'Search query must be at least 2 characters long' 
            });
        }

        // Build search filter
        let filter = {
            isActive: true,
            $or: [
                { itemName: { $regex: q, $options: 'i' } },
                { itemDescription: { $regex: q, $options: 'i' } },
                { foodID: { $regex: q, $options: 'i' } }
            ]
        };

        // Add category filter if specified
        if (category && category !== 'all') {
            filter.itemCategory = category;
        }

        const items = await Item.find(filter)
            .sort({ createdAt: -1 })
            .limit(20); // Limit to 20 results

        console.log(`Found ${items.length} items matching search: ${q}`);

        res.status(200).json({ 
            message: 'Search completed successfully', 
            query: q,
            category: category || 'all',
            count: items.length,
            items: items.map(item => ({
                id: item._id,
                itemName: item.itemName,
                itemCategory: item.itemCategory,
                foodID: item.foodID,
                itemPrice: item.itemPrice,
                itemDescription: item.itemDescription,
                itemImage: item.itemImage,
                isTrending: item.isTrending,
                createdAt: item.createdAt
            }))
        });
    } catch (error) {
        console.error('Error searching items:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message 
        });
    }
};

// Add super Admin user 

const loginAdmin = async (req, res) => {
    console.log('Admin login request received:', req.body);
    
    const { email, password } = req.body;

    try {
        // Find the admin by email
        console.log('Finding admin with email:', email);
        const admin = await Admin.findOne({ email });
        if (!admin) {
            console.log('Admin not found');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the password with the hashed password
        console.log('Comparing admin passwords...');
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            console.log('Admin password does not match');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a token for admin
        console.log('Generating admin login token...');
        const token = generateToken(admin._id);

        res.status(200).json({ 
            message: 'Admin login successful', 
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                displayName: admin.displayName,
                role: admin.role
            }
        });
    } catch (error) {
        console.error('Admin login error details:', error);
        res.status(500).json({ 
            message: 'Server error', 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// ✅ Add these new admin management functions

// Get all admins (for management)
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({ role: { $ne: 'admin' } }) // Don't show main admins
      .select('-password')
      .populate('createdBy', 'displayName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Admins retrieved successfully',
      count: admins.length,
      admins
    });
  } catch (error) {
    console.error('Error getting admins:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new admin/manager/employee
const createSubAdmin = async (req, res) => {
  console.log('Create sub-admin request:', req.body);
  
  const { email, displayName, password, role, permissions } = req.body;

  try {
    // Validate required fields
    if (!email || !displayName || !password || !role) {
      return res.status(400).json({ 
        message: 'All fields are required',
        required: ['email', 'displayName', 'password', 'role']
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Get creator ID from token (you'll need to implement auth middleware)
    const createdBy = req.admin?.id || null;

    // Create new admin
    const newAdmin = new Admin({
      email: email.toLowerCase(),
      displayName,
      password: hashedPassword,
      role,
      permissions: permissions || [],
      createdBy
    });

    await newAdmin.save();

    res.status(201).json({
      message: `${role} created successfully`,
      admin: {
        id: newAdmin._id,
        email: newAdmin.email,
        displayName: newAdmin.displayName,
        role: newAdmin.role,
        permissions: newAdmin.permissions,
        isActive: newAdmin.isActive,
        createdAt: newAdmin.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating sub-admin:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update admin details
const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { displayName, email, role, permissions, isActive } = req.body;

  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Update fields
    if (displayName) admin.displayName = displayName;
    if (email) admin.email = email.toLowerCase();
    if (role) admin.role = role;
    if (permissions) admin.permissions = permissions;
    if (isActive !== undefined) admin.isActive = isActive;

    await admin.save();

    res.status(200).json({
      message: 'Admin updated successfully',
      admin: {
        id: admin._id,
        email: admin.email,
        displayName: admin.displayName,
        role: admin.role,
        permissions: admin.permissions,
        isActive: admin.isActive
      }
    });

  } catch (error) {
    console.error('Error updating admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete admin
const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Prevent deleting main admin
    if (admin.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete main admin account' });
    }

    await Admin.findByIdAndDelete(id);

    res.status(200).json({
      message: `${admin.role} deleted successfully`,
      deletedAdmin: {
        id: admin._id,
        email: admin.email,
        displayName: admin.displayName,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update main admin profile
const updateMainAdmin = async (req, res) => {
  const { currentPassword, newPassword, displayName, email } = req.body;
  const adminId = req.admin?.id; // From auth middleware

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Verify current password if changing password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: 'Current password is required to change password' });
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }

      // Hash new password
      admin.password = await bcrypt.hash(newPassword, 10);
    }

    // Update other fields
    if (displayName) admin.displayName = displayName;
    if (email) admin.email = email.toLowerCase();

    await admin.save();

    res.status(200).json({
      message: 'Admin profile updated successfully',
      admin: {
        id: admin._id,
        email: admin.email,
        displayName: admin.displayName,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Error updating main admin:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ Update your exports
module.exports = {
  registerUser,
  loginUser,
  addNewItem,
  loadItemById,
  loadAllItems,
  loadItemsByCategory,
  loadTrendingItems,
  searchItems,
  loginAdmin,
  getAllAdmins,      // ✅ Add these
  createSubAdmin,    // ✅ Add these
  updateAdmin,       // ✅ Add these
  deleteAdmin,       // ✅ Add these
  updateMainAdmin,   // ✅ Add these
  upload
};