const express = require('express');

const {
  createExchangeRequest,
  getMyExchanges,
  updateExchangeStatus
} = require('../controllers/exchangeController');

const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createExchangeRequest);
router.get('/me', protect, getMyExchanges);
router.patch('/:id', protect, updateExchangeStatus);

module.exports = router;