const Rating = require('../models/Rating');
const asyncHandler = require('../utils/asyncHandler');

const createRating = asyncHandler(async (req, res) => {
  const { targetUser, targetShop, rating, review } = req.body;

  if (!rating) {
    res.status(400);
    throw new Error('Rating value is required.');
  }

  const newRating = await Rating.create({
    reviewer: req.user._id,
    targetUser,
    targetShop,
    rating,
    review
  });

  res.status(201).json({
    message: 'Rating added successfully',
    rating: newRating
  });
});

const getRatings = asyncHandler(async (req, res) => {
  const { targetUser, targetShop } = req.query;

  const filter = {};

  if (targetUser) {
    filter.targetUser = targetUser;
  }

  if (targetShop) {
    filter.targetShop = targetShop;
  }

  const ratings = await Rating.find(filter)
    .populate('reviewer', 'name email')
    .populate('targetUser', 'name email')
    .populate('targetShop', 'name address')
    .sort({ createdAt: -1 });

  res.json(ratings);
});

module.exports = {
  createRating,
  getRatings
};