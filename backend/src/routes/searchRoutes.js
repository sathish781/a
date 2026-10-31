const express = require('express');
const { getCategorizedSearch, searchBooksWithSources } = require('../controllers/searchController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Root route for categorized search
router.get('/', protect, getCategorizedSearch);

// Specific route for flat book list search
router.get('/books', protect, searchBooksWithSources);

module.exports = router;