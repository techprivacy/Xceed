const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const themeRoutes = require('./routes/themeRoutes');
const orderRoutes = require('./routes/orderRoutes');
const savedCartRoutes = require('./routes/savedCartRoutes');
const accountRoutes = require('./routes/accountRoutes');
const membershipApplicationRoutes = require('./routes/membershipApplicationRoutes');
const newsRoutes = require('./routes/newsRoutes');
const subscriberRoutes = require('./routes/subscriberRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'XCEED API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/theme', themeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/saved-carts', savedCartRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/membership-applications', membershipApplicationRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/subscribers', subscriberRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server error',
  });
});

module.exports = app;
