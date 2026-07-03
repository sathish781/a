const express = require('express');

const { addLibraryBook } = require('../controllers/libraryController');

const protect = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.post(
  '/',
  protect,
  allowRoles('library_staff', 'admin'),
  addLibraryBook
);

module.exports = router;