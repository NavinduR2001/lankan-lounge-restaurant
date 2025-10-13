const User = require('./model');
const Item = require('./itemModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateToken } = require('./utils/generateToken');
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

// Add a new item
const addNewItem = async (req, res) => {
    console.log('Add item request received:', req.body);
    
    const { itemName, itemCategory, foodID, itemPrice, itemDescription, itemImage, isTrending } = req.body;

    try {
        // Check if item with same foodID already exists
        const existingItem = await Item.findOne({ foodID });
        if (existingItem) {
            return res.status(400).json({ message: 'Item with this Food ID already exists' });
        }

        // Create a new item
        const newItem = new Item({
            itemName: itemName.trim(),
            itemCategory,
            foodID: foodID.trim(),
            itemPrice: parseFloat(itemPrice),
            itemDescription: itemDescription.trim(),
            itemImage, // This will be the file path/URL
            isTrending: isTrending || false
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

module.exports = {
    registerUser,
    loginUser,
    addNewItem,
    loadItemById,
    loadAllItems,
    loadItemsByCategory,
    loadTrendingItems,
    searchItems
};