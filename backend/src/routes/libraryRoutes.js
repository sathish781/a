const express = require('express');
const {
  getLibraries,
  getLibraryById,
  addLibraryBook,
  updateLibraryBook,
  deleteLibraryBook,
  getMyCatalog,
  getBorrowHistory,
  approveLibrary,
  rejectLibrary
} = require('../controllers/libraryController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getLibraries);
router.get('/my-catalog', protect, authorize('library', 'admin'), getMyCatalog);
router.get('/borrow-history', protect, authorize('library', 'admin'), getBorrowHistory);
router.get('/:id', getLibraryById);
router.post('/books', protect, authorize('library', 'admin'), addLibraryBook);
router.put('/books/:id', protect, authorize('library', 'admin'), updateLibraryBook);
router.delete('/books/:id', protect, authorize('library', 'admin'), deleteLibraryBook);
router.patch('/:id/approve', protect, authorize('admin'), approveLibrary);
router.patch('/:id/reject', protect, authorize('admin'), rejectLibrary);

module.exports = router;
