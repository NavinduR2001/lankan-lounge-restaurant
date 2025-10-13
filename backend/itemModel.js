const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: true,
    trim: true
  },
  itemCategory: {
    type: String,
    required: true,
    enum: ['sri-lankan', 'indian', 'chinese', 'family-meals', 'desserts', 'bakery', 'pizza', 'beverages']
  },
  foodID: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  itemPrice: {
    type: Number,
    required: true,
    min: 0
  },
  itemDescription: {
    type: String,
    required: true,
    trim: true
  },
  itemImage: {
    type: String, // Store image path/URL
    required: true
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Item', itemSchema);