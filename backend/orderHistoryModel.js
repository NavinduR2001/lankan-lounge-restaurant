const mongoose = require('mongoose');

const orderHistorySchema = new mongoose.Schema({
  originalOrderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order',
    required: true 
  },
  orderNumber: { 
    type: String, 
    required: true,
    unique: true 
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
  originalOrderDate: { 
    type: Date, 
    required: true 
  },
  acceptedDate: { 
    type: Date, 
    default: Date.now 
  },
  pickupTime: { 
    type: String, 
    required: true 
  },
  finalStatus: {
    type: String,
    enum: ['completed', 'cancelled'],
    default: 'completed'
  },
  paymentMethod: { 
    type: String, 
    default: 'Cash on Pickup' 
  }
}, {
  timestamps: true
});

// Index for faster queries
orderHistorySchema.index({ orderNumber: 1 });
orderHistorySchema.index({ acceptedDate: -1 });
orderHistorySchema.index({ customerName: 1 });

module.exports = mongoose.model('OrderHistory', orderHistorySchema);