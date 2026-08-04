const express = require('express');
const { searchBooks, lookupIsbn } = require('../controllers/googleBooksController');

const router = express.Router();

router.get('/search', searchBooks);
router.get('/isbn/:isbn', lookupIsbn);

module.exports = router;
