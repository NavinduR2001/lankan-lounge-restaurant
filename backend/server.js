require('dotenv').config();
const express = require('express');
const app = require('./app');
const mongoose = require('mongoose');
const config = require('./config/database');

const PORT = process.env.PORT || 5000;

// Connect to the database
config();

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});