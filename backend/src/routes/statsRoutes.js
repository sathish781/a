const express = require('express');
const {
  getPublicDashboardStats,
  getShopsList,
  getLibrariesList,
  getExchangesList,
  getShopDashboardStats,
  getStudentDashboardStats,
  getLibraryDashboardStats
} = require('../controllers/statsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/overview', getPublicDashboardStats);
router.get('/shops', getShopsList);
router.get('/libraries', getLibrariesList);
router.get('/exchanges', getExchangesList);
router.get('/shop-dashboard', protect, getShopDashboardStats);
router.get('/student-dashboard', protect, getStudentDashboardStats);
router.get('/library-dashboard', protect, getLibraryDashboardStats);

module.exports = router;
