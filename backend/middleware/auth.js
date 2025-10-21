const jwt = require('jsonwebtoken');
const User = require('../model');
const Admin = require('../adminModel');

// User authentication middleware
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    
    // Handle both 'id' and 'userId' for backward compatibility
    const userId = decoded.id || decoded.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Invalid token format' });
    }
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('User token validation error:', error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin authentication middleware
const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    console.log('🔑 Authenticating admin token...'); // Debug log
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    console.log('🔍 Decoded token:', decoded); // Debug log
    
    // Handle both 'id' and 'userId' for backward compatibility
    const adminId = decoded.id || decoded.userId;
    if (!adminId) {
      console.log('❌ No admin ID found in token');
      return res.status(401).json({ message: 'Invalid token format' });
    }
    
    const admin = await Admin.findById(adminId).select('-password');
    console.log('👤 Found admin:', admin ? admin.email : 'not found'); // Debug log
    
    if (!admin) {
      return res.status(401).json({ message: 'Admin not found' });
    }

    // Only allow admin role
    if (admin.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }

    if (!admin.isActive) {
      return res.status(403).json({ message: 'Account is suspended' });
    }

    req.admin = admin;
    console.log('✅ Admin authentication successful for:', admin.email); // Debug log
    next();
  } catch (error) {
    console.error('❌ Admin token validation error:', error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = {
  authenticateUser,
  authenticateAdmin
};