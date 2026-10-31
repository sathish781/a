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
const statsRoutes = require('./routes/statsRoutes');
const messageRoutes = require('./routes/messageRoutes');
const searchRoutes = require('./routes/searchRoutes');
const orderRoutes = require('./routes/orderRoutes');
const libraryRequestRoutes = require('./routes/libraryRequestRoutes');
const shopRequestRoutes = require('./routes/shopRequestRoutes');

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: false // allow images to be served cross-origin
}));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting - increased for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000, // Increased to 2000
  message: { message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api/', limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

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
app.use('/api/stats', statsRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/library-requests', libraryRequestRoutes);
app.use('/api/shop-requests', shopRequestRoutes);
app.use('/api/orders', orderRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;