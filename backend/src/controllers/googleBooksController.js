const { searchGoogleBooks, lookupBookByIsbn } = require('../services/googleBooksService');
const asyncHandler = require('../utils/asyncHandler');

// @desc  Search Google Books by query
// @route GET /api/google-books/search?q=...
const searchBooks = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length < 2) {
    res.status(400);
    throw new Error('Search query must be at least 2 characters.');
  }

  const results = await searchGoogleBooks(q);
  res.json(results);
});

// @desc  Lookup book by ISBN via Google Books
// @route GET /api/google-books/isbn/:isbn
const lookupIsbn = asyncHandler(async (req, res) => {
  const { isbn } = req.params;

  if (!isbn) {
    res.status(400);
    throw new Error('ISBN is required.');
  }

  const book = await lookupBookByIsbn(isbn);

  if (!book) {
    res.status(404);
    throw new Error('No book found for this ISBN.');
  }

  res.json(book);
});

module.exports = {
  searchBooks,
  lookupIsbn
};
