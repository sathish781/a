const Book = require('../models/Book');
const Marketplace = require('../models/Marketplace');
const Order = require('../models/Order');
const Donation = require('../models/Donation');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

// @desc  Get all student marketplace listings
// @route GET /api/marketplace
const getMarketplaceListings = asyncHandler(async (req, res) => {
  const { q = '', category = '', condition = '' } = req.query;

  const bookFilter = { availability: true };
  if (q) {
    bookFilter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { author: { $regex: q, $options: 'i' } },
      { isbn: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } }
    ];
  }
  if (category) bookFilter.category = { $regex: category, $options: 'i' };

  const matchedBookIds = (await Book.find(bookFilter).select('_id')).map(b => b._id);

  const filter = {
    book: { $in: matchedBookIds },
    status: 'available',
    approvalStatus: 'approved'
  };
  if (condition) filter.condition = condition;

  const listings = await Marketplace.find(filter)
    .populate('book', 'title author isbn category description imageUrl publishedDate condition listingType')
    .populate('seller', 'name email phone college location profileImage locationName')
    .sort({ createdAt: -1 });

  res.json(listings);
});

// @desc  Create a buy request (Student to Student)
// @route POST /api/marketplace/:id/request
const createBuyRequest = asyncHandler(async (req, res) => {
  const listing = await Marketplace.findById(req.params.id)
    .populate('book')
    .populate('seller');

  if (!listing || listing.status !== 'available') {
    res.status(404);
    throw new Error('Listing not found or no longer available.');
  }

  if (listing.seller._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot buy your own book.');
  }

  // Create order in 'pending' status
  const order = await Order.create({
    buyer: req.user._id,
    seller: listing.seller._id,
    book: listing.book._id,
    price: listing.price,
    status: 'pending'
  });

  // Notify seller
  await Notification.create({
    user: listing.seller._id,
    title: '📩 New Buy Request!',
    message: `${req.user.name} wants to buy "${listing.book.title}" for ₹${listing.price}.`,
    type: 'order_request',
    data: { orderId: order._id }
  });

  res.status(201).json({ message: 'Buy request sent to seller.', order });
});

// @desc  Accept a buy request
// @route PATCH /api/marketplace/orders/:id/accept
const acceptBuyRequest = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('book').populate('buyer');

  if (!order) {
    res.status(404);
    throw new Error('Order request not found.');
  }

  if (order.seller.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to accept this request.');
  }

  order.status = 'accepted';
  await order.save();

  // Mark book as sold and listing as sold
  await Book.findByIdAndUpdate(order.book._id, { availability: false, marketplaceStatus: 'sold' });
  await Marketplace.findOneAndUpdate({ book: order.book._id }, { status: 'sold' });

  // Notify buyer
  await Notification.create({
    user: order.buyer._id,
    title: '✅ Buy Request Accepted!',
    message: `Your request to buy "${order.book.title}" was accepted. Coordinate pickup with the seller!`,
    type: 'order_accepted',
    data: { orderId: order._id }
  });

  res.json({ message: 'Order accepted.', order });
});

// @desc  Reject a buy request
// @route PATCH /api/marketplace/orders/:id/reject
const rejectBuyRequest = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('book');

  if (!order) {
    res.status(404);
    throw new Error('Order request not found.');
  }

  if (order.seller.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to reject this request.');
  }

  order.status = 'rejected';
  await order.save();

  // Notify buyer
  await Notification.create({
    user: order.buyer._id,
    title: '❌ Buy Request Declined',
    message: `Your request to buy "${order.book.title}" was declined by the seller.`,
    type: 'order_rejected',
    data: { orderId: order._id }
  });

  res.json({ message: 'Order rejected.', order });
});

// @desc  Get my purchase requests (as buyer)
// @route GET /api/marketplace/my-purchases
const getMyPurchases = asyncHandler(async (req, res) => {
  const orders = await Order.find({ buyer: req.user._id })
    .populate('book', 'title author imageUrl')
    .populate('seller', 'name college phone locationName')
    .sort({ createdAt: -1 });
  res.json(orders);
});

// @desc  Get my sale requests (as seller)
// @route GET /api/marketplace/my-sales
const getMySales = asyncHandler(async (req, res) => {
  const orders = await Order.find({ seller: req.user._id })
    .populate('book', 'title author imageUrl')
    .populate('buyer', 'name college phone locationName')
    .sort({ createdAt: -1 });
  res.json(orders);
});

// @desc  Get my marketplace listings
// @route GET /api/marketplace/my-listings
const getMyListings = asyncHandler(async (req, res) => {
  const listings = await Marketplace.find({ seller: req.user._id })
    .populate('book', 'title author isbn category imageUrl condition listingType')
    .sort({ createdAt: -1 });
  res.json(listings);
});

// @desc  Create a marketplace listing (sell/exchange a book)
// @route POST /api/marketplace
const createMarketplaceListing = asyncHandler(async (req, res) => {
  const {
    title, author, isbn, publisher, category, description,
    condition, price, imageUrl, location, latitude, longitude,
    listingType
  } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Book title is required.');
  }

  // Create the Book record
  const book = await Book.create({
    title,
    author: author || 'Unknown Author',
    isbn: isbn || '',
    publisher: publisher || '',
    category: category || 'General',
    description: description || '',
    condition: condition || 'Good',
    price: Number(price || 0),
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60',
    owner: req.user._id,
    role: req.user.role,
    sourceType: 'student',
    listingType: listingType || 'sell',
    exchangeStatus: listingType === 'exchange' ? 'available' : 'none',
    location: location || req.user.location || '',
    latitude: latitude || req.user.latitude,
    longitude: longitude || req.user.longitude,
    availability: true,
    marketplaceStatus: 'approved'
  });

  // Create the Marketplace listing
  const listing = await Marketplace.create({
    book: book._id,
    seller: req.user._id,
    price: Number(price || 0),
    condition: condition || 'Good',
    approvalStatus: 'approved',
    status: 'available'
  });

  // If it's a donation, also create a Donation record so it shows on the Donation screen
  if (listingType === 'donate') {
    await Donation.create({
      book: book._id,
      donor: req.user._id,
      pickupLocation: location || req.user.location || '',
      adminApprovalStatus: 'approved', // Auto-approve so it shows immediately
      status: 'available'
    });
  }

  res.status(201).json({ message: 'Book listing created successfully', listing });
});

// @desc  Update a listing
// @route PUT /api/marketplace/:id
const updateMarketplaceListing = asyncHandler(async (req, res) => {
  const listing = await Marketplace.findById(req.params.id);
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found.');
  }

  if (listing.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this listing.');
  }

  if (req.body.price !== undefined) listing.price = Number(req.body.price);
  if (req.body.condition) listing.condition = req.body.condition;
  if (req.body.status) listing.status = req.body.status;
  if (req.body.approvalStatus) listing.approvalStatus = req.body.approvalStatus;

  const updated = await listing.save();
  res.json({ message: 'Listing updated', listing: updated });
});

// @desc  Delete a listing
// @route DELETE /api/marketplace/:id
const deleteMarketplaceListing = asyncHandler(async (req, res) => {
  const listing = await Marketplace.findById(req.params.id);
  if (!listing) {
    res.status(404);
    throw new Error('Listing not found.');
  }

  if (listing.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this listing.');
  }

  await listing.deleteOne();
  res.json({ message: 'Listing removed.' });
});

module.exports = {
  getMarketplaceListings,
  getMyListings,
  createMarketplaceListing,
  createBuyRequest,
  acceptBuyRequest,
  rejectBuyRequest,
  getMyPurchases,
  getMySales,
  updateMarketplaceListing,
  deleteMarketplaceListing
};
