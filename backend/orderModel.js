const mongoose = require('mongoose');

// ✅ Disable auto-indexing to prevent orderId_1 from being created
mongoose.set('autoIndex', false);

const orderSchema = new mongoose.Schema({
  orderNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: false
  }, 
  customerName: { 
    type: String, 
    required: true 
  },
  customerEmail: { 
    type: String 
  },
  customerPhone: { 
    type: String 
  },
  items: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: String
  }],
  totalAmount: { 
    type: Number, 
    required: true 
  },
  pickupTime: { 
    type: String, 
    required: true 
  },
  orderDate: { 
    type: Date, 
    default: Date.now 
  },
  paymentMethod: { 
    type: String, 
    default: 'Cash on Pickup' 
  },
  status: { 
    type: String, 
    enum: ['pending', 'preparing', 'confirmed', 'ready', 'completed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true,
  autoIndex: false, // ✅ Disable auto-indexing
  collection: 'orders'
});

// ✅ Only create the index we want
orderSchema.index({ orderNumber: 1 }, { unique: true, name: 'orderNumber_unique' });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;