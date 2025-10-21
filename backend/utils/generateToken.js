require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign(
    { 
      id: id,           // ✅ Use 'id' instead of 'userId'
      iat: Math.floor(Date.now() / 1000)
    }, 
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '7d' }
  );
};

module.exports = { generateToken };