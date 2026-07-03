const express = require('express');
const cors = require('cors');
const path = require('path');

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

const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
  res.json({
    message: 'BookConnect API running successfully'
  });
});

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

app.use(notFound);
app.use(errorHandler);

module.exports = app;