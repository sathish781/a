const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  blockUser,
  deleteUser,
  resetUserPassword,
  assignRole,
  manageShopApproval,
  manageLibraryApproval,
  getAllBooks,
  adminDeleteBook,
  sendGlobalAnnouncement,
  checkLibraryOverdue
} = require('../controllers/adminController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

// All admin routes require authentication + admin role
router.use(protect, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/block', blockUser);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/reset-password', resetUserPassword);
router.patch('/users/:id/role', assignRole);

router.patch('/shops/:id/:action', manageShopApproval);
router.patch('/libraries/:id/:action', manageLibraryApproval);

router.get('/books', getAllBooks);
router.delete('/books/:id', adminDeleteBook);
router.post('/announcement', sendGlobalAnnouncement);
router.post('/check-overdue', checkLibraryOverdue);

module.exports = router;
