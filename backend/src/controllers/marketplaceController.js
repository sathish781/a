const Book = require('../models/Book');
const Marketplace = require('../models/Marketplace');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

// @desc  Get all marketplace listings
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

  const filter = { book: { $in: matchedBookIds }, status: 'available', approvalStatus: 'approved' };
  if (condition) filter.condition = condition;

  const listings = await Marketplace.find(filter)
    .populate('book', 'title author isbn category description imageUrl publishedDate')
    .populate('seller', 'name email phone college location profileImage')
    .sort({ createdAt: -1 });

  res.json(listings);
});

// @desc  Get my marketplace listings
// @route GET /api/marketplace/my-listings
const getMyListings = asyncHandler(async (req, res) => {
  const listings = await Marketplace.find({ seller: req.user._id })
    .populate('book', 'title author isbn category imageUrl')
    .sort({ createdAt: -1 });
  res.json(listings);
});

// @desc  Create a marketplace listing (sell a book)
// @route POST /api/marketplace
const createMarketplaceListing = asyncHandler(async (req, res) => {
  const {
    title, author, isbn, publisher, category, description,
    condition, price, imageUrl, location, latitude, longitude
  } = req.body;

  if (!title || price === undefined) {
    res.status(400);
    throw new Error('Book title and price are required.');
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
    price: Number(price),
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60',
    owner: req.user._id,
    role: req.user.role,
    location: location || req.user.location || '',
    latitude: latitude || req.user.latitude,
    longitude: longitude || req.user.longitude,
    availability: true,
    marketplaceStatus: req.user.role === 'admin' ? 'approved' : 'pending'
  });

  // Create the Marketplace listing
  const listing = await Marketplace.create({
    book: book._id,
    seller: req.user._id,
    price: Number(price),
    condition: condition || 'Good',
    approvalStatus: req.user.role === 'admin' ? 'approved' : 'approved', // auto-approve for now
    status: 'available'
  });

  res.status(201).json({ message: 'Book listing created successfully', listing });
});

// @desc  Buy a book from marketplace
// @route POST /api/marketplace/:id/buy
const buyBook = asyncHandler(async (req, res) => {
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

  // Mark as sold
  listing.status = 'sold';
  await listing.save();

  // Mark book as not available
  await Book.findByIdAndUpdate(listing.book._id, {
    availability: false,
    marketplaceStatus: 'sold'
  });

  // Create order record
  const order = await Order.create({
    buyer: req.user._id,
    seller: listing.seller._id,
    book: listing.book._id,
    price: listing.price
  });

  // Notify seller
  await Notification.create({
    user: listing.seller._id,
    title: 'Book Sold!',
    message: `Your book "${listing.book.title}" has been purchased by ${req.user.name}.`,
    type: 'book_sold'
  });

  res.json({ message: 'Book purchased successfully!', order });
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
  buyBook,
  updateMarketplaceListing,
  deleteMarketplaceListing
};