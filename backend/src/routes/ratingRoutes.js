const express = require('express');
const { createRating, getUserRatings, getBookRatings } = require('../controllers/ratingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createRating);
router.get('/user/:userId', getUserRatings);
router.get('/book/:bookId', getBookRatings);

module.exports = router;
