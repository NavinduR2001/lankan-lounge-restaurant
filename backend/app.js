require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const router = require('./router');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// ✅ Fix CORS - Allow all origins for development
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Handle preflight requests
app.options('*', cors());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
const db = require('./config/database');
db();

// Routes
app.use('/api', router);

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

module.exports = app;