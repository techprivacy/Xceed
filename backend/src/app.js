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
const memberRoutes = require('./routes/memberRoutes');
const orderRoutes = require('./routes/orderRoutes');
const savedCartRoutes = require('./routes/savedCartRoutes');
const accountRoutes = require('./routes/accountRoutes');
const membershipApplicationRoutes = require('./routes/membershipApplicationRoutes');

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
// /api/members: the old approval-gated Member login+directory system.
// Superseded by /api/accounts (self-service login) + /api/membership-
// applications (the separate, still-approval-gated business flow) — left
// mounted rather than removed in case anything else still depends on it,
// but the frontend no longer calls it as of this change.
app.use('/api/members', memberRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/saved-carts', savedCartRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/membership-applications', membershipApplicationRoutes);

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
