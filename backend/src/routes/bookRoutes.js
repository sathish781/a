const express = require('express');
const {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  getMyBooks,
  getPriceComparison
} = require('../controllers/bookController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getBooks);
router.get('/my-books', protect, getMyBooks);
router.get('/:id', getBookById);
router.get('/:id/compare', getPriceComparison);
router.post('/', protect, createBook);
router.put('/:id', protect, updateBook);
router.delete('/:id', protect, deleteBook);

module.exports = router;
