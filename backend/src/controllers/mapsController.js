const User = require('../models/User');
const Book = require('../models/Book');
const Donation = require('../models/Donation');
const { calculateDistance } = require('../utils/distanceCalculator');
const asyncHandler = require('../utils/asyncHandler');

// @desc  Get nearby libraries
// @route GET /api/maps/nearby-libraries?lat=..&lng=..&radius=..
const getNearbyLibraries = asyncHandler(async (req, res) => {
  const { lat, lng, radius = 25 } = req.query;

  const libraries = await User.find({ role: 'library', status: 'active', approvalStatus: 'approved' })
    .select('-password');

  const results = libraries.map(lib => ({
    _id: lib._id,
    name: lib.libraryName || lib.name,
    address: lib.libraryAddress || lib.location,
    phone: lib.phone,
    email: lib.email,
    profileImage: lib.profileImage,
    latitude: lib.latitude,
    longitude: lib.longitude,
    distance: lat && lng ? calculateDistance(
      parseFloat(lat), parseFloat(lng),
      lib.latitude, lib.longitude
    ) : null
  })).filter(lib =>
    !lat || !lng || lib.distance === null || lib.distance <= parseFloat(radius)
  ).sort((a, b) => (a.distance || 0) - (b.distance || 0));

  res.json(results);
});

// @desc  Get nearby shops
// @route GET /api/maps/nearby-shops?lat=..&lng=..&radius=..
const getNearbyShops = asyncHandler(async (req, res) => {
  const { lat, lng, radius = 25 } = req.query;

  const shops = await User.find({ role: 'shop', status: 'active', approvalStatus: 'approved' })
    .select('-password');

  const results = shops.map(shop => ({
    _id: shop._id,
    name: shop.shopName || shop.name,
    address: shop.shopAddress || shop.location,
    phone: shop.phone,
    email: shop.email,
    profileImage: shop.profileImage,
    businessDescription: shop.businessDescription,
    latitude: shop.latitude,
    longitude: shop.longitude,
    distance: lat && lng ? calculateDistance(
      parseFloat(lat), parseFloat(lng),
      shop.latitude, shop.longitude
    ) : null
  })).filter(shop =>
    !lat || !lng || shop.distance === null || shop.distance <= parseFloat(radius)
  ).sort((a, b) => (a.distance || 0) - (b.distance || 0));

  res.json(results);
});

// @desc  Get nearby donated books
// @route GET /api/maps/nearby-donations?lat=..&lng=..&radius=..
const getNearbyDonations = asyncHandler(async (req, res) => {
  const { lat, lng, radius = 25 } = req.query;

  const donations = await Donation.find({ adminApprovalStatus: 'approved', status: 'available' })
    .populate('book', 'title author isbn category imageUrl condition location latitude longitude')
    .populate('donor', 'name location latitude longitude');

  const results = donations.map(d => {
    const bookLat = d.book?.latitude;
    const bookLng = d.book?.longitude;
    const dist = (lat && lng && bookLat && bookLng)
      ? calculateDistance(parseFloat(lat), parseFloat(lng), bookLat, bookLng)
      : null;

    return {
      _id: d._id,
      book: d.book,
      donor: d.donor,
      pickupLocation: d.pickupLocation,
      distance: dist,
      notes: d.notes
    };
  }).filter(d =>
    !lat || !lng || d.distance === null || d.distance <= parseFloat(radius)
  ).sort((a, b) => (a.distance || 0) - (b.distance || 0));

  res.json(results);
});

module.exports = {
  getNearbyLibraries,
  getNearbyShops,
  getNearbyDonations
};
