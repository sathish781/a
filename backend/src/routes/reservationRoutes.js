const express = require('express');
const {
  reserveBook,
  getMyReservations,
  getLibraryReservations,
  updateReservationStatus
} = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', reserveBook);
router.get('/my-holds', getMyReservations);
router.get('/library-requests', getLibraryReservations);
router.patch('/:id/status', updateReservationStatus);

module.exports = router;