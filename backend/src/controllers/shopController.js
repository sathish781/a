const Book = require('../models/Book');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// @desc  Get all approved shop owners
// @route GET /api/shops
const getShops = asyncHandler(async (req, res) => {
  const shops = await User.find({ role: 'shop', status: 'active' })
    .select('-password')
    .sort({ createdAt: -1 });
  res.json(shops);
});

// @desc  Get shop owner profile + their books
// @route GET /api/shops/:id
const getShopById = asyncHandler(async (req, res) => {
  const shop = await User.findOne({ _id: req.params.id, role: 'shop' }).select('-password');
  if (!shop) {
    res.status(404);
    throw new Error('Shop not found.');
  }
  const books = await Book.find({ owner: shop._id, availability: true }).sort({ createdAt: -1 });
  res.json({ shop, books });
});

// @desc  Add a book to shop inventory
// @route POST /api/shops/books
const addShopBook = asyncHandler(async (req, res) => {
  const {
    title, author, isbn, publisher, category, description,
    condition, price, imageUrl, location, latitude, longitude
  } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Book title is required.');
  }

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
    role: 'shop',
    location: location || req.user.shopAddress || '',
    latitude: latitude || req.user.latitude || 40.7128,
    longitude: longitude || req.user.longitude || -74.0060,
    availability: true,
    marketplaceStatus: 'approved'
  });

  res.status(201).json({ message: 'Book added to shop inventory', book });
});

// @desc  Update a shop book
// @route PUT /api/shops/books/:id
const updateShopBook = asyncHandler(async (req, res) => {
  const book = await Book.findOne({ _id: req.params.id, owner: req.user._id });
  if (!book) {
    res.status(404);
    throw new Error('Book not found in your inventory.');
  }

  const allowedFields = ['title', 'author', 'isbn', 'category', 'description', 'condition', 'price', 'imageUrl', 'availability'];
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) book[field] = req.body[field];
  });

  const updatedBook = await book.save();
  res.json({ message: 'Book updated successfully', book: updatedBook });
});

// @desc  Delete a shop book
// @route DELETE /api/shops/books/:id
const deleteShopBook = asyncHandler(async (req, res) => {
  const book = await Book.findOne({ _id: req.params.id, owner: req.user._id });
  if (!book) {
    res.status(404);
    throw new Error('Book not found in your inventory.');
  }
  await book.deleteOne();
  res.json({ message: 'Book removed from inventory.' });
});

// @desc  Admin: Approve a shop owner
// @route PATCH /api/shops/:id/approve
const approveShop = asyncHandler(async (req, res) => {
  const shop = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'shop' },
    { approvalStatus: 'approved', status: 'active' },
    { new: true }
  ).select('-password');

  if (!shop) {
    res.status(404);
    throw new Error('Shop not found.');
  }

  res.json({ message: 'Shop approved successfully', shop });
});

// @desc  Admin: Reject a shop owner
// @route PATCH /api/shops/:id/reject
const rejectShop = asyncHandler(async (req, res) => {
  const shop = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'shop' },
    { approvalStatus: 'rejected' },
    { new: true }
  ).select('-password');

  if (!shop) {
    res.status(404);
    throw new Error('Shop not found.');
  }

  res.json({ message: 'Shop rejected.', shop });
});

// @desc  Get all books in current shop owner's inventory
// @route GET /api/shops/my-inventory
const getMyInventory = asyncHandler(async (req, res) => {
  const books = await Book.find({ owner: req.user._id, role: 'shop' }).sort({ createdAt: -1 });
  res.json(books);
});

module.exports = {
  getShops,
  getShopById,
  addShopBook,
  updateShopBook,
  deleteShopBook,
  approveShop,
  rejectShop,
  getMyInventory
};