const User = require('../models/User');
const Book = require('../models/Book');
const Exchange = require('../models/Exchange');
const ShopRequest = require('../models/ShopRequest');
const LibraryRequest = require('../models/LibraryRequest');
const Message = require('../models/Message');
const asyncHandler = require('../utils/asyncHandler');

// @desc  Get public dashboard overview stats (real data from DB)
// @route GET /api/stats/overview
const getPublicDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalBooks,
    totalLibraries,
    totalShops,
    totalExchanges
  ] = await Promise.all([
    Book.countDocuments(),
    User.countDocuments({ role: 'library', status: 'active', approvalStatus: 'approved' }),
    User.countDocuments({ role: 'shop', status: 'active', approvalStatus: 'approved' }),
    Exchange.countDocuments()
  ]);

  res.json({
    totalBooks,
    totalLibraries,
    totalShops,
    totalExchanges
  });
});

// @desc  Get list of all approved local shops with their real details
// @route GET /api/stats/shops
const getShopsList = asyncHandler(async (req, res) => {
  const shops = await User.find({
    role: 'shop',
    status: 'active',
    approvalStatus: 'approved'
  })
    .select('shopName shopAddress businessDescription phone email location latitude longitude profileImage createdAt')
    .sort({ createdAt: -1 });

  // Enrich each shop with their book count
  const shopsWithCount = await Promise.all(
    shops.map(async (shop) => {
      const bookCount = await Book.countDocuments({ owner: shop._id, availability: true });
      return {
        _id: shop._id,
        shopName: shop.shopName || 'Unnamed Shop',
        shopAddress: shop.shopAddress || shop.location || 'Address not provided',
        businessDescription: shop.businessDescription || 'Local bookstore',
        phone: shop.phone || '',
        email: shop.email || '',
        location: shop.location || '',
        latitude: shop.latitude || null,
        longitude: shop.longitude || null,
        profileImage: shop.profileImage || '',
        bookCount,
        joinedDate: shop.createdAt
      };
    })
  );

  res.json(shopsWithCount);
});

// @desc  Get list of all approved libraries with their real details
// @route GET /api/stats/libraries
const getLibrariesList = asyncHandler(async (req, res) => {
  const libraries = await User.find({
    role: 'library',
    status: 'active',
    approvalStatus: 'approved'
  })
    .select('libraryName libraryAddress phone email location latitude longitude profileImage createdAt')
    .sort({ createdAt: -1 });

  const librariesWithCount = await Promise.all(
    libraries.map(async (lib) => {
      const bookCount = await Book.countDocuments({ owner: lib._id, availability: true });
      return {
        _id: lib._id,
        libraryName: lib.libraryName || 'Unnamed Library',
        libraryAddress: lib.libraryAddress || lib.location || 'Address not provided',
        phone: lib.phone || '',
        email: lib.email || '',
        location: lib.location || '',
        latitude: lib.latitude || null,
        longitude: lib.longitude || null,
        profileImage: lib.profileImage || '',
        bookCount,
        joinedDate: lib.createdAt
      };
    })
  );

  res.json(librariesWithCount);
});

// @desc  Get list of active book exchanges
// @route GET /api/stats/exchanges
const getExchangesList = asyncHandler(async (req, res) => {
  const exchanges = await Exchange.find({ status: 'pending' })
    .populate('requester', 'name college location profileImage')
    .populate('requestedBook', 'title author category condition imageUrl price')
    .populate('offeredBook', 'title author category condition imageUrl price')
    .sort({ createdAt: -1 })
    .limit(50);

  res.json(exchanges);
});

// @desc  Get shop owner dashboard stats
// @route GET /api/stats/shop-dashboard
const getShopDashboardStats = asyncHandler(async (req, res) => {
  const shopId = req.user._id;

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [
    inStockBooks,
    pendingOrders,
    inquiries,
    monthlySalesData
  ] = await Promise.all([
    Book.countDocuments({ owner: shopId, availability: true }),
    ShopRequest.countDocuments({ shopId, status: 'PENDING' }),
    Message.countDocuments({ receiver: shopId, read: false }),
    ShopRequest.aggregate([
      {
        $match: {
          shopId,
          status: 'COMPLETED',
          updatedAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$price' }
        }
      }
    ])
  ]);

  res.json({
    inStockBooks,
    pendingOrders,
    inquiries,
    monthlySales: monthlySalesData.length > 0 ? monthlySalesData[0].totalSales : 0
  });
});

// @desc  Get student dashboard stats
// @route GET /api/stats/student-dashboard
const getStudentDashboardStats = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  const [
    listedBooks,
    activeSwaps,
    donations,
    reservations
  ] = await Promise.all([
    Book.countDocuments({ owner: studentId }),
    Exchange.countDocuments({
      $or: [{ requester: studentId }, { targetUser: studentId }],
      status: 'pending'
    }),
    Book.countDocuments({ owner: studentId, listingType: 'donate' }),
    LibraryRequest.countDocuments({
      studentId,
      status: { $in: ['PENDING', 'APPROVED'] }
    })
  ]);

  res.json({
    listedBooks,
    activeSwaps,
    donations,
    reservations
  });
});

// @desc  Get library dashboard stats
// @route GET /api/stats/library-dashboard
const getLibraryDashboardStats = asyncHandler(async (req, res) => {
  const libraryId = req.user._id;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    catalogTitles,
    pendingHolds,
    activeLoans,
    returnedToday
  ] = await Promise.all([
    Book.countDocuments({ owner: libraryId }),
    LibraryRequest.countDocuments({ libraryId, status: 'PENDING' }),
    LibraryRequest.countDocuments({ libraryId, status: 'APPROVED' }),
    LibraryRequest.countDocuments({
      libraryId,
      status: 'RETURNED',
      updatedAt: { $gte: startOfToday }
    })
  ]);

  res.json({
    catalogTitles,
    pendingHolds,
    activeLoans,
    returnedToday
  });
});

module.exports = {
  getPublicDashboardStats,
  getShopsList,
  getLibrariesList,
  getExchangesList,
  getShopDashboardStats,
  getStudentDashboardStats,
  getLibraryDashboardStats
};
