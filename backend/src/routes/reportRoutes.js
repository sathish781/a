const express = require('express');

const {
  getDashboardReport
} = require('../controllers/reportController');

const protect = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.get(
  '/dashboard',
  protect,
  allowRoles('admin'),
  getDashboardReport
);

module.exports = router;