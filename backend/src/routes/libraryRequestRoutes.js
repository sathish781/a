const express = require('express');
const {
  createLibraryRequest,
  acceptLibraryRequest,
  rejectLibraryRequest,
  returnLibraryBook,
  getStudentLibraryRequests,
  getLibraryIncomingRequests
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', createLibraryRequest);
router.get('/student', getStudentLibraryRequests);
router.get('/library', getLibraryIncomingRequests);
router.patch('/:id/accept', acceptLibraryRequest);
router.patch('/:id/reject', rejectLibraryRequest);
router.patch('/:id/return', returnLibraryBook);

module.exports = router;