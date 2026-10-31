const express = require('express');
const {
  getDonations,
  createDonation,
  getMyDonations,
  approveDonation,
  rejectDonation,
  deleteDonation,
  getAllDonations,
  requestDonation,
  acceptDonationClaim,
  rejectDonationClaim,
  getMyClaims
} = require('../controllers/donationController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getDonations);
router.get('/all', protect, authorize('admin'), getAllDonations);
router.get('/my-donations', protect, getMyDonations);
router.get('/my-claims', protect, getMyClaims);
router.post('/', protect, createDonation);
router.post('/request', protect, requestDonation);
router.patch('/:id/accept-claim', protect, acceptDonationClaim);
router.patch('/:id/reject-claim', protect, rejectDonationClaim);
router.patch('/:id/approve', protect, authorize('admin'), approveDonation);
router.patch('/:id/reject', protect, authorize('admin'), rejectDonation);
router.delete('/:id', protect, authorize('admin'), deleteDonation);

module.exports = router;
