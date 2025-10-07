require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
    try {
        const token = jwt.sign(
            { userId: userId }, 
            process.env.JWT_SECRET, 
            { expiresIn: '30d' }
        );
        return token;
    } catch (error) {
        console.error('Token generation error:', error);
        throw new Error('Failed to generate token');
    }
};

module.exports = { generateToken };