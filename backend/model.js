const mongoose = require('mongoose');
const cartItemSchema = new mongoose.Schema({
  id: String,
  foodID: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: String,
  description: String,
  category: String,
  quantity: { type: Number, required: true, min: 1 }
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/ // Simple email validation
  },
  city: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  contactNumber: {
    type: String,
    required: true,
    minlength: 10
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  cart: {
    type: [cartItemSchema],
    default: []
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;