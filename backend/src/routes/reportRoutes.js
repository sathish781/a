const express = require('express');
const {
  getMonthlyDonations,
  getMonthlyExchanges,
  getMostSearched,
  getMostActiveUsers,
  getSummary
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/donations', getMonthlyDonations);
router.get('/exchanges', getMonthlyExchanges);
router.get('/most-searched', getMostSearched);
router.get('/most-active', getMostActiveUsers);
router.get('/summary', getSummary);

module.exports = router;
