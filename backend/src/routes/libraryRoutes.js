const express = require('express');

const {
  getLibraries,
  createLibrary,
  addLibraryBook
} = require('../controllers/libraryController');

const protect = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getLibraries);

router.post(
  '/',
  protect,
  allowRoles('library_staff', 'admin'),
  createLibrary
);

router.post(
  '/books',
  protect,
  allowRoles('library_staff', 'admin'),
  addLibraryBook
);

module.exports = router;