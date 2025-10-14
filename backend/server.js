require('dotenv').config();
const express = require('express');
const path = require('path');
const app = require('./app');
const mongoose = require('mongoose');
const config = require('./config/database');

const PORT = process.env.PORT || 5000;

// Connect to the database
config();

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});