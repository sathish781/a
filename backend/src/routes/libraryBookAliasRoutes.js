const express = require('express');

const { addLibraryBook } = require('../controllers/libraryController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post(
  '/',
  protect,
  authorize('library', 'admin'),
  addLibraryBook
);

module.exports = router;

