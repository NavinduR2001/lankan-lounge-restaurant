const mongoose = require('mongoose');

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
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;