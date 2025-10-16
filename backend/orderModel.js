const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  customerName: { type: String, required: true },
  customerEmail: { type: String },
  customerPhone: { type: String },
  items: [{
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  totalAmount: { type: Number, required: true },
  pickupTime: { type: String, required: true },
  orderDate: { type: Date, default: Date.now },
  paymentMethod: { type: String, default: 'Cash on Pickup' },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
    default: 'pending'
  }
});

// ✅ Remove any existing problematic indexes and ensure only orderNumber is unique
orderSchema.index({ orderNumber: 1 }, { unique: true });

module.exports = mongoose.model('Order', orderSchema);