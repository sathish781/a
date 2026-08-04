const User = require('../models/User');
const Book = require('../models/Book');
const Donation = require('../models/Donation');
const Exchange = require('../models/Exchange');
const Order = require('../models/Order');
const SearchHistory = require('../models/SearchHistory');
const asyncHandler = require('../utils/asyncHandler');

// @desc  Get monthly donations report
// @route GET /api/reports/donations
const getMonthlyDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 }
  ]);
  res.json(donations);
});

// @desc  Get monthly exchanges report
// @route GET /api/reports/exchanges
const getMonthlyExchanges = asyncHandler(async (req, res) => {
  const exchanges = await Exchange.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 12 }
  ]);
  res.json(exchanges);
});

// @desc  Most searched books
// @route GET /api/reports/most-searched
const getMostSearched = asyncHandler(async (req, res) => {
  const searches = await SearchHistory.aggregate([
    { $group: { _id: '$query', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);
  res.json(searches);
});

// @desc  Most active users
// @route GET /api/reports/most-active
const getMostActiveUsers = asyncHandler(async (req, res) => {
  const activeUsers = await SearchHistory.aggregate([
    { $match: { user: { $ne: null } } },
    { $group: { _id: '$user', activityCount: { $sum: 1 } } },
    { $sort: { activityCount: -1 } },
    { $limit: 10 }
  ]);

  // populate user names
  const User = require('../models/User');
  const populated = await Promise.all(
    activeUsers.map(async (u) => {
      const user = await User.findById(u._id).select('name email role college');
      return { user, activityCount: u.activityCount };
    })
  );

  res.json(populated.filter(p => p.user));
});

// @desc  Overall admin report summary
// @route GET /api/reports/summary
const getSummary = asyncHandler(async (req, res) => {
  const [totalUsers, totalBooks, totalOrders, totalDonations, totalExchanges] = await Promise.all([
    User.countDocuments(),
    Book.countDocuments(),
    Order.countDocuments(),
    Donation.countDocuments(),
    Exchange.countDocuments()
  ]);

  res.json({ totalUsers, totalBooks, totalOrders, totalDonations, totalExchanges });
});

module.exports = {
  getMonthlyDonations,
  getMonthlyExchanges,
  getMostSearched,
  getMostActiveUsers,
  getSummary
};