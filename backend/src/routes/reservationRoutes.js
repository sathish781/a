const express = require('express');
const {
  getMyReservations,
  getIncomingReservations,
  createReservation,
  acceptReservation,
  rejectReservation,
  cancelReservation
} = require('../controllers/reservationController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/my-reservations', protect, getMyReservations);
router.get('/incoming', protect, getIncomingReservations);
router.post('/', protect, createReservation);
router.patch('/:id/accept', protect, acceptReservation);
router.patch('/:id/reject', protect, rejectReservation);
router.patch('/:id/cancel', protect, cancelReservation);

module.exports = router;
