const express = require('express');

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  resetWithHint,
  getProfile,
  updateProfile
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-with-hint', resetWithHint);
router.put('/reset-password/:resettoken', resetPassword);
router.get('/me', protect, getProfile);
router.put('/profile', protect, updateProfile);

module.exports = router;

