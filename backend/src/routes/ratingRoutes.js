const express = require('express');

const {
  createRating,
  getRatings
} = require('../controllers/ratingController');

const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getRatings);
router.post('/', protect, createRating);

module.exports = router;