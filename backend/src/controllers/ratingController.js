const Rating = require('../models/Rating');
const asyncHandler = require('../utils/asyncHandler');

// @desc  Create a rating
// @route POST /api/ratings
const createRating = asyncHandler(async (req, res) => {
  const { targetUserId, targetBookId, rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5.');
  }

  const ratingDoc = await Rating.create({
    reviewer: req.user._id,
    targetUser: targetUserId || undefined,
    targetBook: targetBookId || undefined,
    rating: Number(rating),
    comment: comment || ''
  });

  res.status(201).json({ message: 'Rating submitted.', rating: ratingDoc });
});

// @desc  Get ratings for a user
// @route GET /api/ratings/user/:userId
const getUserRatings = asyncHandler(async (req, res) => {
  const ratings = await Rating.find({ targetUser: req.params.userId })
    .populate('reviewer', 'name profileImage')
    .sort({ createdAt: -1 });
  res.json(ratings);
});

// @desc  Get ratings for a book
// @route GET /api/ratings/book/:bookId
const getBookRatings = asyncHandler(async (req, res) => {
  const ratings = await Rating.find({ targetBook: req.params.bookId })
    .populate('reviewer', 'name profileImage')
    .sort({ createdAt: -1 });
  res.json(ratings);
});

module.exports = { createRating, getUserRatings, getBookRatings };