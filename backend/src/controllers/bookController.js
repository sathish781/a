const Book = require('../models/Book');
const User = require('../models/User');
const SearchHistory = require('../models/SearchHistory');
const asyncHandler = require('../utils/asyncHandler');

// @desc  Get all books with optional search & filter
// @route GET /api/books
const getBooks = asyncHandler(async (req, res) => {
  const { q = '', category = '', role = '', location = '', type = '' } = req.query;

  const filter = { availability: true };

  // Map 'type' from search UI filter chips if 'role' is not explicitly provided
  const targetRole = role || (['shop', 'library', 'student'].includes(type) ? type : type === 'college' ? 'student' : '');
  if (targetRole) {
    filter.role = targetRole;
  }

  if (type === 'isbn' && q) {
    filter.isbn = { $regex: q, $options: 'i' };
  } else if (q) {
    filter.$or = [
      { title: { $regex: q, $options: 'i' } },
      { author: { $regex: q, $options: 'i' } },
      { isbn: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } },
      { publisher: { $regex: q, $options: 'i' } }
    ];
  }

  if (category) filter.category = { $regex: category, $options: 'i' };
  if (location) filter.location = { $regex: location, $options: 'i' };

  const books = await Book.find(filter)
    .populate('owner', 'name email role shopName libraryName college location profileImage')
    .sort({ createdAt: -1 })
    .limit(100);

  // Save search history if user is logged in and query provided
  if (req.user && q) {
    await SearchHistory.create({
      user: req.user._id,
      query: q,
      category: category || '',
      location: location || ''
    }).catch(() => { }); // silently fail if history save fails
  }

  res.json(books);
});

// @desc  Get a single book by ID with categorized availability
// @route GET /api/books/:id
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id)
    .populate('owner', 'name email role shopName libraryName college location profileImage phone');

  if (!book) {
    res.status(404);
    throw new Error('Book not found.');
  }

  // Find all availability of this book (by ISBN or same title if ISBN missing)
  const query = { availability: true };
  if (book.isbn) {
    query.isbn = book.isbn;
  } else {
    query.title = book.title;
  }

  const allCopies = await Book.find(query)
    .populate('owner', 'name email role shopName libraryName college location profileImage phone');

  const libraries = allCopies.filter(b => b.sourceType === 'library' || b.role === 'library');
  const shops = allCopies.filter(b => b.sourceType === 'shop' || b.role === 'shop');
  const students = allCopies.filter(b => b.sourceType === 'student' || b.role === 'student');

  res.json({
    book,
    libraries,
    shops,
    students
  });
});

// @desc  Create a book (admin or authorized user)
// @route POST /api/books
const createBook = asyncHandler(async (req, res) => {
  const {
    title, author, isbn, publisher, category, description,
    condition, price, imageUrl, location, latitude, longitude,
    donationStatus, exchangeStatus, marketplaceStatus
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
    role: req.user.role,
    sourceType: req.user.role === 'shop' ? 'shop' : req.user.role === 'library' ? 'library' : 'student',
    location: location || req.user.location || '',
    latitude: latitude || req.user.latitude || 40.7128,
    longitude: longitude || req.user.longitude || -74.0060,
    availability: true,
    donationStatus: donationStatus || 'none',
    exchangeStatus: exchangeStatus || 'none',
    marketplaceStatus: marketplaceStatus || 'none'
  });

  res.status(201).json({ message: 'Book added successfully', book });
});

// @desc  Update a book
// @route PUT /api/books/:id
const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error('Book not found.');
  }

  // Only owner or admin can update
  if (book.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this book.');
  }

  const allowedFields = [
    'title', 'author', 'isbn', 'publisher', 'category', 'description',
    'condition', 'price', 'imageUrl', 'availability', 'location',
    'latitude', 'longitude', 'donationStatus', 'exchangeStatus', 'marketplaceStatus'
  ];
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) book[field] = req.body[field];
  });

  const updatedBook = await book.save();
  res.json({ message: 'Book updated successfully', book: updatedBook });
});

// @desc  Delete a book
// @route DELETE /api/books/:id
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error('Book not found.');
  }

  if (book.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this book.');
  }

  await book.deleteOne();
  res.json({ message: 'Book deleted successfully.' });
});

// @desc  Get books owned by current user
// @route GET /api/books/my-books
const getMyBooks = asyncHandler(async (req, res) => {
  const books = await Book.find({ owner: req.user._id }).sort({ createdAt: -1 });
  res.json(books);
});

// @desc  Get price comparison for a book across sources
// @route GET /api/books/:id/compare
const getPriceComparison = asyncHandler(async (req, res) => {
  const bookId = req.params.id;

  const similarBooks = await Book.find({
    $or: [
      { _id: bookId },
      { isbn: (await Book.findById(bookId))?.isbn || '__none__' }
    ]
  })
    .populate('owner', 'name role shopName libraryName college location profileImage')
    .sort({ price: 1 });

  const result = similarBooks.map(b => ({
    _id: b._id,
    source: b.role === 'library' ? 'Library' : b.role === 'shop' ? 'Book Shop' : 'Student',
    ownerName: b.owner?.shopName || b.owner?.libraryName || b.owner?.name,
    location: b.location,
    price: b.price,
    condition: b.condition,
    availability: b.availability,
    imageUrl: b.imageUrl
  }));

  res.json(result);
});

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getMyBooks,
  getPriceComparison
};