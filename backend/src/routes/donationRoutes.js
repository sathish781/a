const express = require('express');

const {
  getDonations,
  requestDonation,
  updateDonationStatus
} = require('../controllers/donationController');

const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getDonations);
router.post('/request', protect, requestDonation);
router.patch('/:id', protect, updateDonationStatus);

module.exports = router;