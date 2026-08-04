const express = require('express');
const {
  getDonations,
  createDonation,
  getMyDonations,
  approveDonation,
  rejectDonation,
  deleteDonation,
  getAllDonations
} = require('../controllers/donationController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getDonations);
router.get('/all', protect, authorize('admin'), getAllDonations);
router.get('/my-donations', protect, getMyDonations);
router.post('/', protect, createDonation);
router.patch('/:id/approve', protect, authorize('admin'), approveDonation);
router.patch('/:id/reject', protect, authorize('admin'), rejectDonation);
router.delete('/:id', protect, authorize('admin'), deleteDonation);

module.exports = router;
