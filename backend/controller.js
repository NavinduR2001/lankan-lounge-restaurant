const User = require('./model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require('./utils/generateToken'); // Make sure this line is correct
const hashPassword = require('./utils/hashPassword');

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

module.exports = {
    registerUser,
    loginUser,
};