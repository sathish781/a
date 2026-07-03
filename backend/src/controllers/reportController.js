const User = require('../models/User');
const Book = require('../models/Book');
const Library = require('../models/Library');
const Shop = require('../models/Shop');
const StudentBook = require('../models/StudentBook');
const Donation = require('../models/Donation');
const Exchange = require('../models/Exchange');
const Reservation = require('../models/Reservation');
const asyncHandler = require('../utils/asyncHandler');

const getDashboardReport = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalBooks = await Book.countDocuments();
  const totalLibraries = await Library.countDocuments();
  const totalShops = await Shop.countDocuments();
  const totalMarketplace = await StudentBook.countDocuments();
  const totalDonations = await Donation.countDocuments();
  const totalExchanges = await Exchange.countDocuments();
  const totalReservations = await Reservation.countDocuments();

  const latestUsers = await User.find()
    .select('name email role createdAt')
    .sort({ createdAt: -1 })
    .limit(5);

  const booksByExam = await Book.aggregate([
    {
      $group: {
        _id: '$examType',
        total: {
          $sum: 1
        }
      }
    },
    {
      $sort: {
        total: -1
      }
    }
  ]);

  res.json({
    totalUsers,
    totalBooks,
    totalLibraries,
    totalShops,
    totalMarketplace,
    totalDonations,
    totalExchanges,
    totalReservations,
    latestUsers,
    booksByExam
  });
});

module.exports = {
  getDashboardReport
};