const Book = require('../models/Book');
const User = require('../models/User');
const BorrowHistory = require('../models/BorrowHistory');
const Reservation = require('../models/Reservation');
const asyncHandler = require('../utils/asyncHandler');

// @desc  Get all approved libraries
// @route GET /api/libraries
const getLibraries = asyncHandler(async (req, res) => {
  const libraries = await User.find({ role: 'library', status: 'active' })
    .select('-password')
    .sort({ createdAt: -1 });
  res.json(libraries);
});

// @desc  Get a library by ID with its catalog
// @route GET /api/libraries/:id
const getLibraryById = asyncHandler(async (req, res) => {
  const library = await User.findOne({ _id: req.params.id, role: 'library' }).select('-password');
  if (!library) {
    res.status(404);
    throw new Error('Library not found.');
  }
  const books = await Book.find({ owner: library._id, role: 'library' }).sort({ createdAt: -1 });
  res.json({ library, books });
});

// @desc  Add a book to library catalog
// @route POST /api/libraries/books
const addLibraryBook = asyncHandler(async (req, res) => {
  const {
    title, author, isbn, publisher, category, description,
    condition, imageUrl, location, latitude, longitude
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
    price: 0,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60',
    owner: req.user._id,
    role: 'library',
    location: location || req.user.libraryAddress || '',
    latitude: latitude || req.user.latitude || 40.7128,
    longitude: longitude || req.user.longitude || -74.0060,
    availability: true
  });

  res.status(201).json({ message: 'Book added to library catalog', book });
});

// @desc  Update a library book's availability
// @route PUT /api/libraries/books/:id
const updateLibraryBook = asyncHandler(async (req, res) => {
  const book = await Book.findOne({ _id: req.params.id, owner: req.user._id });
  if (!book) {
    res.status(404);
    throw new Error('Book not found in your catalog.');
  }

  const allowedFields = ['title', 'author', 'isbn', 'category', 'description', 'condition', 'imageUrl', 'availability'];
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) book[field] = req.body[field];
  });

  const updatedBook = await book.save();
  res.json({ message: 'Book updated', book: updatedBook });
});

// @desc  Delete a library book
// @route DELETE /api/libraries/books/:id
const deleteLibraryBook = asyncHandler(async (req, res) => {
  const book = await Book.findOne({ _id: req.params.id, owner: req.user._id });
  if (!book) {
    res.status(404);
    throw new Error('Book not found in your catalog.');
  }
  await book.deleteOne();
  res.json({ message: 'Book removed from catalog.' });
});

// @desc  Get current library's book catalog
// @route GET /api/libraries/my-catalog
const getMyCatalog = asyncHandler(async (req, res) => {
  const books = await Book.find({ owner: req.user._id, role: 'library' }).sort({ createdAt: -1 });
  res.json(books);
});

// @desc  Get borrow history for current library
// @route GET /api/libraries/borrow-history
const getBorrowHistory = asyncHandler(async (req, res) => {
  const history = await BorrowHistory.find({ library: req.user._id })
    .populate('student', 'name email phone college')
    .populate('book', 'title author isbn category imageUrl')
    .sort({ createdAt: -1 });
  res.json(history);
});

// @desc  Admin: Approve a library
// @route PATCH /api/libraries/:id/approve
const approveLibrary = asyncHandler(async (req, res) => {
  const library = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'library' },
    { approvalStatus: 'approved', status: 'active' },
    { new: true }
  ).select('-password');

  if (!library) {
    res.status(404);
    throw new Error('Library not found.');
  }

  res.json({ message: 'Library approved successfully', library });
});

// @desc  Admin: Reject a library
// @route PATCH /api/libraries/:id/reject
const rejectLibrary = asyncHandler(async (req, res) => {
  const library = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'library' },
    { approvalStatus: 'rejected' },
    { new: true }
  ).select('-password');

  if (!library) {
    res.status(404);
    throw new Error('Library not found.');
  }

  res.json({ message: 'Library rejected.', library });
});

module.exports = {
  getLibraries,
  getLibraryById,
  addLibraryBook,
  updateLibraryBook,
  deleteLibraryBook,
  getMyCatalog,
  getBorrowHistory,
  approveLibrary,
  rejectLibrary
};