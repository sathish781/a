const Book = require('../models/Book');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get categorized search results (Library, Shop, Student)
// @route   GET /api/search
const getCategorizedSearch = asyncHandler(async (req, res) => {
  const { query, sourceType } = req.query;

  const filter = {
    availability: true
  };

  if (query) {
    filter.title = { $regex: query, $options: 'i' };
  }

  if (sourceType) {
    filter.sourceType = sourceType;
  }

  const results = await Book.find(filter)
    .populate('owner', 'name role shopName libraryName college location shopAddress libraryAddress phone');

  // Categorize results
  const categorized = {
    library: results.filter(b => b.sourceType === 'library'),
    shop: results.filter(b => b.sourceType === 'shop'),
    student: results.filter(b => b.sourceType === 'student')
  };

  res.json(categorized);
});

// @desc    Search books with sources (Flat list for general search)
// @route   GET /api/search/books
const searchBooksWithSources = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    res.status(400);
    throw new Error('Please enter a book name to search.');
  }

  // Find all books matching the title
  const books = await Book.find({
    title: { $regex: q, $options: 'i' },
    availability: true
  }).populate('owner', 'name role shopName libraryName phone location shopAddress libraryAddress');

  res.json({
    query: q,
    results: books
  });
});

module.exports = { getCategorizedSearch, searchBooksWithSources };