const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Route imports
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const libraryRoutes = require('./routes/libraryRoutes');
const shopRoutes = require('./routes/shopRoutes');
const libraryBookAliasRoutes = require('./routes/libraryBookAliasRoutes');
const shopBookAliasRoutes = require('./routes/shopBookAliasRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const exchangeRoutes = require('./routes/exchangeRoutes');
const donationRoutes = require('./routes/donationRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const reportRoutes = require('./routes/reportRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const adminRoutes = require('./routes/adminRoutes');
const googleBooksRoutes = require('./routes/googleBooksRoutes');
const mapsRoutes = require('./routes/mapsRoutes');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: false // allow images to be served cross-origin
}));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting - 200 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static file serving for local uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'BookConnect API v2.0 - Smart Book Finder and Exchange Platform',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/libraries', libraryRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/library-books', libraryBookAliasRoutes);
app.use('/api/shop-books', shopBookAliasRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/exchanges', exchangeRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/google-books', googleBooksRoutes);
app.use('/api/maps', mapsRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;