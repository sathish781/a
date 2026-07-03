const Book = require('../models/Book');
const LibraryBook = require('../models/LibraryBook');
const ShopBook = require('../models/ShopBook');
const StudentBook = require('../models/StudentBook');
const asyncHandler = require('../utils/asyncHandler');

const getBooks = asyncHandler(async (req, res) => {
  const q = req.query.q || '';

  const books = await Book.find({
    $or: [
      { title: { $regex: q, $options: 'i' } },
      { author: { $regex: q, $options: 'i' } },
      { isbn: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } },
      { subject: { $regex: q, $options: 'i' } },
      { course: { $regex: q, $options: 'i' } },
      { semester: { $regex: q, $options: 'i' } },
      { examType: { $regex: q, $options: 'i' } }
    ]
  }).sort({ createdAt: -1 });

  res.json(books);
});

const createBook = asyncHandler(async (req, res) => {
  const book = await Book.create(req.body);

  res.status(201).json({
    message: 'Book added successfully',
    book
  });
});

const getBookDetails = asyncHandler(async (req, res) => {
  const bookId = req.params.id;

  const book = await Book.findById(bookId);

  if (!book) {
    res.status(404);
    throw new Error('Book not found.');
  }

  const libraries = await LibraryBook.find({ book: bookId })
    .populate('library')
    .populate('book');

  const shops = await ShopBook.find({ book: bookId })
    .populate('shop')
    .populate('book');

  const students = await StudentBook.find({
    book: bookId,
    status: 'available'
  })
    .populate('seller', 'name email phone college location badgeCount')
    .populate('book');

  res.json({
    book,
    libraries,
    shops,
    students
  });
});

const getPriceComparison = asyncHandler(async (req, res) => {
  const bookId = req.params.id;

  const libraryBooks = await LibraryBook.find({ book: bookId })
    .populate('library')
    .populate('book');

  const shopBooks = await ShopBook.find({ book: bookId })
    .populate('shop')
    .populate('book');

  const studentBooks = await StudentBook.find({
    book: bookId,
    status: 'available'
  })
    .populate('seller', 'name location')
    .populate('book');

  const result = [];

  libraryBooks.forEach((item) => {
    result.push({
      source: 'Library',
      name: item.library?.name,
      address: item.library?.address,
      price: 0,
      stock: item.availableCopies,
      note: 'Free borrowing'
    });
  });

  shopBooks.forEach((item) => {
    result.push({
      source: 'Local Book Shop',
      name: item.shop?.name,
      address: item.shop?.address,
      price: item.price,
      stock: item.stock,
      note: 'New book'
    });
  });

  studentBooks.forEach((item) => {
    result.push({
      source: 'Student Marketplace',
      name: item.seller?.name,
      address: item.seller?.location,
      price: item.price,
      stock: 1,
      note: item.listingType
    });
  });

  result.sort((a, b) => a.price - b.price);

  res.json(result);
});

module.exports = {
  getBooks,
  createBook,
  getBookDetails,
  getPriceComparison
};