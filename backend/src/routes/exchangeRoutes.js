const express = require('express');
const {
  getExchanges,
  listBookForExchange,
  createExchangeRequest,
  acceptExchange,
  rejectExchange,
  getMyExchanges,
  getAllExchanges
} = require('../controllers/exchangeController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getExchanges);
router.get('/all', protect, authorize('admin'), getAllExchanges);
router.get('/my-exchanges', protect, getMyExchanges);
router.post('/list', protect, listBookForExchange);
router.post('/request', protect, createExchangeRequest);
router.patch('/:id/accept', protect, acceptExchange);
router.patch('/:id/reject', protect, rejectExchange);

module.exports = router;
