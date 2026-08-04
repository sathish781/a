const express = require('express');
const {
  getShops,
  getShopById,
  addShopBook,
  updateShopBook,
  deleteShopBook,
  approveShop,
  rejectShop,
  getMyInventory
} = require('../controllers/shopController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getShops);
router.get('/my-inventory', protect, authorize('shop', 'admin'), getMyInventory);
router.get('/:id', getShopById);
router.post('/books', protect, authorize('shop', 'admin'), addShopBook);
router.put('/books/:id', protect, authorize('shop', 'admin'), updateShopBook);
router.delete('/books/:id', protect, authorize('shop', 'admin'), deleteShopBook);
router.patch('/:id/approve', protect, authorize('admin'), approveShop);
router.patch('/:id/reject', protect, authorize('admin'), rejectShop);

module.exports = router;
