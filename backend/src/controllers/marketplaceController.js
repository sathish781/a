const Book = require('../models/Book');
const StudentBook = require('../models/StudentBook');
const Donation = require('../models/Donation');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const getMarketplaceListings = asyncHandler(async (req, res) => {
  const q = req.query.q || '';
  const listingType = req.query.type;

  const matchedBooks = await Book.find({
    $or: [
      { title: { $regex: q, $options: 'i' } },
      { author: { $regex: q, $options: 'i' } },
      { isbn: { $regex: q, $options: 'i' } },
      { examType: { $regex: q, $options: 'i' } },
      { subject: { $regex: q, $options: 'i' } }
    ]
  }).select('_id');

  const filter = {
    book: {
      $in: matchedBooks.map((book) => book._id)
    },
    status: 'available'
  };

  if (listingType) {
    filter.listingType = listingType;
  }

  const listings = await StudentBook.find(filter)
    .populate('seller', 'name email phone college location badgeCount')
    .populate('book')
    .sort({ createdAt: -1 });

  res.json(listings);
});

const createMarketplaceListing = asyncHandler(async (req, res) => {
  const {
    title,
    author,
    isbn,
    category,
    subject,
    course,
    semester,
    examType,
    description,
    imageUrl,
    price,
    condition,
    listingType
  } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Book title is required.');
  }

  const book = await Book.create({
    title,
    author,
    isbn,
    category,
    subject,
    course,
    semester,
    examType,
    description,
    imageUrl
  });

  const listing = await StudentBook.create({
    seller: req.user._id,
    book: book._id,
    price: Number(price || 0),
    condition: condition || 'Good',
    listingType: listingType || 'sell',
    imageUrl,
    status: 'available'
  });

  if (listing.listingType === 'donate') {
    await Donation.create({
      donor: req.user._id,
      listing: listing._id,
      status: 'available'
    });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        badgeCount: 1
      }
    });
  }

  res.status(201).json({
    message: 'Book listing added successfully',
    listing
  });
});

const updateMarketplaceListing = asyncHandler(async (req, res) => {
  const listing = await StudentBook.findById(req.params.id);

  if (!listing) {
    res.status(404);
    throw new Error('Listing not found.');
  }

  if (
    listing.seller.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('You are not allowed to update this listing.');
  }

  Object.assign(listing, req.body);

  if (req.body.price !== undefined) {
    listing.price = Number(req.body.price);
  }

  await listing.save();

  res.json({
    message: 'Listing updated successfully',
    listing
  });
});

const deleteMarketplaceListing = asyncHandler(async (req, res) => {
  const listing = await StudentBook.findById(req.params.id);

  if (!listing) {
    res.status(404);
    throw new Error('Listing not found.');
  }

  if (
    listing.seller.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('You are not allowed to delete this listing.');
  }

  await listing.deleteOne();

  res.json({
    message: 'Listing deleted successfully'
  });
});

module.exports = {
  getMarketplaceListings,
  createMarketplaceListing,
  updateMarketplaceListing,
  deleteMarketplaceListing
};