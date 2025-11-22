const express = require('express');
const router = express.Router();
const { authenticateUser, authenticateAdmin } = require('./middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);  

const { 
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
  moveOrderToHistory,
  getOrderHistory,
  getOrderHistoryStats,
  deleteItem
} = require('./controller');

// User routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/admin-login', loginAdmin);

// Item routes
router.post('/add-item', authenticateAdmin, upload.single('image'), addNewItem);
router.get('/items', loadAllItems);
router.get('/items/category/:category', loadItemsByCategory);
router.get('/items/trending', loadTrendingItems);
router.get('/items/search', searchItems);
router.delete('/items/:itemId', authenticateAdmin, deleteItem); // ✅ ADD THIS

// Cart routes
router.get('/cart', authenticateUser, getUserCart);
router.put('/cart', authenticateUser, updateUserCart);          // ✅ ADD THIS

// Admin routes
router.put('/admin/update', authenticateAdmin, updateMainAdmin);   // ✅ Current route
router.put('/admin-profile', authenticateAdmin, updateMainAdmin);  // ✅ ADD THIS (what frontend expects)

// Order routes
router.post('/orders', authenticateUser, createOrder);
router.get('/orders', authenticateAdmin, getAllOrders);
router.get('/orders/user', authenticateUser, getUserOrders);

// Order management routes
router.put('/orders/:orderId', authenticateAdmin, updateOrderStatus);           // ✅ ADD THIS
router.delete('/orders/:orderId', authenticateAdmin, deleteOrder);              // ✅ ADD THIS
router.post('/orders/:orderId/move-to-history', authenticateAdmin, moveOrderToHistory); // ✅ ADD THIS

// Order History routes
router.get('/order-history', authenticateAdmin, getOrderHistory);
router.get('/order-history/stats', authenticateAdmin, getOrderHistoryStats);

// Payment routes
router.post('/create-checkout-session', authenticateUser, async (req, res) => {
  try {
    const { products, totalAmount, pickupTime } = req.body;
    
    console.log('Received products:', products);
    console.log('Total amount:', totalAmount);
    console.log('Pickup time:', pickupTime);
    

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ 
        error: 'Invalid products data',
        message: 'Products array is required'
      });
    }

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ 
        error: 'Invalid amount',
        message: 'Total amount must be greater than 0'
      });
    }
    
    
    const lineItems = products.map(product => {
      if (!product.name || !product.price || !product.quantity) {
        throw new Error('Invalid product format: name, price, and quantity are required');
      }
      
      return {
        price_data: {
          currency: 'lkr',
          product_data: {
            name: product.name,
            description: product.description || `Delicious ${product.name}`,
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: product.quantity,
      };
    });

   
    const itemsTotal = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
    console.log('📊 Items subtotal:', itemsTotal);
    
   
    const difference = totalAmount - itemsTotal;
    console.log('📊 Price difference (fees - discounts):', difference);


    if (difference > 0) {
      lineItems.push({
        price_data: {
          currency: 'lkr',
          product_data: {
            name: 'Service Fee & Charges',
            description: 'Processing and service charges',
          },
          unit_amount: Math.round(difference * 100),
        },
        quantity: 1,
      });
    }

    
    if (difference < 0) {
      lineItems.push({
        price_data: {
          currency: 'lkr',
          product_data: {
            name: 'Discount Applied',
            description: 'Your special discount',
          },
          unit_amount: Math.round(difference * 100), // Will be negative
        },
        quantity: 1,
      });
    }

    console.log('Line items created with charges:', lineItems);

   
    const itemsJson = JSON.stringify(products.map(p => ({
      n: p.name,
      q: p.quantity,
      p: p.price
    })));

    console.log('📦 Items JSON length:', itemsJson.length);

    const orderMetadata = {
      pickupTime: pickupTime,
      totalAmount: totalAmount.toString(),
      userId: req.user._id.toString(),
      customerName: req.user.name,
      customerEmail: req.user.email,
      customerPhone: req.user.contactNumber || 'N/A',
      items: itemsJson
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `http://localhost:5173/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/cart`,
      metadata: orderMetadata,
      customer_email: req.user.email
    });

    console.log('Stripe session created:', session.id);
    console.log('Total amount in session:', session.amount_total / 100, 'LKR');

    res.json({ 
      id: session.id,
      sessionId: session.id,
      url: session.url
    });
    
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message 
    });
  }
});


router.get('/verify-payment-session/:sessionId', authenticateUser, async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    console.log('🔍 Verifying payment session:', sessionId);
    
  
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    console.log('✅ Session retrieved');
    
    // Check if payment was successful
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ 
        error: 'Payment not completed',
        message: 'Payment was not successful'
      });
    }

    
    let items = [];
    try {
      const itemsData = JSON.parse(session.metadata.items);
      items = itemsData.map(item => ({
        name: item.n,       
        quantity: item.q,
        price: item.p
      }));
      console.log('Parsed items from metadata:', items);
    } catch (parseError) {
      console.error('Error parsing items:', parseError);
      return res.status(400).json({ 
        error: 'Invalid items data',
        message: 'Unable to parse order items'
      });
    }

    if (items.length === 0) {
      return res.status(400).json({ 
        error: 'Cart is empty',
        message: 'No items found in order'
      });
    }
    
    // Return session data with items
    res.json({
      id: session.id,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      metadata: session.metadata,
      items: items  
    });
    
  } catch (error) {
    console.error('Error verifying payment session:', error);
    res.status(500).json({ 
      error: 'Internal Server Error', 
      message: error.message 
    });
  }
});

module.exports = router;