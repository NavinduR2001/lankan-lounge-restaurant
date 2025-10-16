const User = require('./model');
const Item = require('./itemModel');
const Admin = require('./adminModel');
const Order = require('./orderModel');
const OrderHistory = require('./orderHistoryModel'); // ✅ New import
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

// Get user's cart
const getUserCart = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return cart data or empty array if no cart
    const cartData = user.cart || [];
    
    res.status(200).json({
      message: 'Cart retrieved successfully',
      cart: cartData,
      itemCount: cartData.reduce((count, item) => count + item.quantity, 0)
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update user's cart
const updateUserCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { cartItems } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate cart items structure
    if (!Array.isArray(cartItems)) {
      return res.status(400).json({ message: 'Cart items must be an array' });
    }

    // Update user's cart
    user.cart = cartItems;
    await user.save();
    
    const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    
    res.status(200).json({
      message: 'Cart updated successfully',
      cart: cartItems,
      itemCount
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new order
const createOrder = async (req, res) => {
  try {
    // Get user ID from authenticated user (optional for guest orders)
    const userId = req.user?._id || null;
    
    // ✅ Generate unique order number with timestamp and random component
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    const orderNumber = `ORD${timestamp}${randomNum}`;
    
    const orderData = {
      ...req.body,
      userId: userId,
      orderDate: new Date(),
      orderNumber: orderNumber // ✅ Use generated order number
    };
    
    console.log('📝 Creating order:', {
      orderNumber: orderData.orderNumber,
      customerName: orderData.customerName,
      totalAmount: orderData.totalAmount,
      itemCount: orderData.items?.length || 0
    });
    
    const order = new Order(orderData);
    await order.save();
    
    console.log('✅ Order created successfully:', order.orderNumber);
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: order
    });
  } catch (error) {
    console.error('❌ Create order error:', error);
    
    // ✅ Handle specific duplicate key errors
    if (error.code === 11000) {
      // Try again with a different order number
      try {
        const timestamp = Date.now();
        const randomNum = Math.floor(Math.random() * 100000);
        const orderNumber = `ORD${timestamp}${randomNum}`;
        
        const orderData = {
          ...req.body,
          userId: req.user?._id || null,
          orderDate: new Date(),
          orderNumber: orderNumber
        };
        
        const order = new Order(orderData);
        await order.save();
        
        console.log('✅ Order created on retry:', order.orderNumber);
        
        res.status(201).json({
          success: true,
          message: 'Order created successfully',
          order: order
        });
        return;
      } catch (retryError) {
        console.error('❌ Retry failed:', retryError);
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message
    });
  }
};

// Get all orders (for admin)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderDate: -1 });
    res.status(200).json({
      success: true,
      orders: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    console.log('Updating order status:', orderId, 'to:', status);
    
    // Find by orderNumber instead of _id
    const order = await Order.findOneAndUpdate(
      { orderNumber: orderId },
      { status },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order: order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
};

// Get user's orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'User orders retrieved successfully',
      count: orders.length,
      orders
    });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const deletedOrder = await Order.findOneAndDelete({ orderNumber: orderId });

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
      order: deletedOrder
    });
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message
    });
  }
};

// Move order to history when accepted
const moveOrderToHistory = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    console.log('📝 Moving order to history:', orderId);
    
    // Find the original order
    const order = await Order.findOne({ orderNumber: orderId });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Check if order is already in history
    const existingHistory = await OrderHistory.findOne({ orderNumber: orderId });
    if (existingHistory) {
      return res.status(400).json({
        success: false,
        message: 'Order already exists in history'
      });
    }
    
    // Create history record
    const historyData = {
      originalOrderId: order._id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      items: order.items,
      totalAmount: order.totalAmount,
      originalOrderDate: order.orderDate,
      pickupTime: order.pickupTime,
      paymentMethod: order.paymentMethod,
      acceptedDate: new Date(),
      finalStatus: 'completed'
    };
    
    const orderHistory = new OrderHistory(historyData);
    await orderHistory.save();
    
    // Update original order status to confirmed
    order.status = 'confirmed';
    await order.save();
    
    console.log('✅ Order moved to history successfully:', orderId);
    
    res.status(200).json({
      success: true,
      message: 'Order moved to history and confirmed',
      historyRecord: orderHistory,
      updatedOrder: order
    });
    
  } catch (error) {
    console.error('❌ Move order to history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error moving order to history',
      error: error.message
    });
  }
};

// Get all order history records
const getOrderHistory = async (req, res) => {
  try {
    const { page = 1, limit = 50, status, startDate, endDate } = req.query;
    
    let filter = {};
    
    if (status) {
      filter.finalStatus = status;
    }
    
    if (startDate || endDate) {
      filter.acceptedDate = {};
      if (startDate) filter.acceptedDate.$gte = new Date(startDate);
      if (endDate) filter.acceptedDate.$lte = new Date(endDate);
    }
    
    const skip = (page - 1) * limit;
    
    const historyRecords = await OrderHistory
      .find(filter)
      .sort({ acceptedDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalRecords = await OrderHistory.countDocuments(filter);
    
    res.status(200).json({
      success: true,
      message: 'Order history retrieved successfully',
      data: {
        records: historyRecords,
        totalRecords,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalRecords / limit),
        hasNextPage: skip + historyRecords.length < totalRecords,
        hasPrevPage: page > 1
      }
    });
    
  } catch (error) {
    console.error('❌ Get order history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving order history',
      error: error.message
    });
  }
};

// Get order history statistics (for reporting)
const getOrderHistoryStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let matchCondition = {};
    if (startDate || endDate) {
      matchCondition.acceptedDate = {};
      if (startDate) matchCondition.acceptedDate.$gte = new Date(startDate);
      if (endDate) matchCondition.acceptedDate.$lte = new Date(endDate);
    }
    
    const stats = await OrderHistory.aggregate([
      { $match: matchCondition },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$finalStatus', 'completed'] }, 1, 0] }
          },
          cancelledOrders: {
            $sum: { $cond: [{ $eq: ['$finalStatus', 'cancelled'] }, 1, 0] }
          }
        }
      }
    ]);
    
    const itemStats = await OrderHistory.aggregate([
      { $match: matchCondition },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.name',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 }
    ]);
    
    res.status(200).json({
      success: true,
      message: 'Order history statistics retrieved successfully',
      data: {
        summary: stats[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
          completedOrders: 0,
          cancelledOrders: 0
        },
        topItems: itemStats
      }
    });
    
  } catch (error) {
    console.error('❌ Get order history stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving order history statistics',
      error: error.message
    });
  }
};

// Update the existing module.exports to include new functions
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
  upload,
  getUserCart,
  updateUserCart,
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getUserOrders,
  deleteOrder,
  moveOrderToHistory,      // ✅ New function
  getOrderHistory,         // ✅ New function
  getOrderHistoryStats     // ✅ New function
};