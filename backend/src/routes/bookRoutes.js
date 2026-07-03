const express = require('express');

const {
  getBooks,
  createBook,
  getBookDetails,
  getPriceComparison
} = require('../controllers/bookController');

const protect = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getBooks);

router.post(
  '/',
  protect,
  allowRoles('library_staff', 'shop_owner', 'admin'),
  createBook
);

router.get('/:id/prices', getPriceComparison);
router.get('/:id', getBookDetails);

module.exports = router;