const express = require('express');
const {
  createShopRequest,
  acceptShopRequest,
  rejectShopRequest,
  completeShopRequest,
  getStudentShopRequests,
  getShopIncomingRequests
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', createShopRequest);
router.get('/student', getStudentShopRequests);
router.get('/shop', getShopIncomingRequests);
router.patch('/:id/accept', acceptShopRequest);
router.patch('/:id/reject', rejectShopRequest);
router.patch('/:id/complete', completeShopRequest);

module.exports = router;