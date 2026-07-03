const express = require('express');

const {
  getShops,
  createShop,
  addShopBook,
  approveShop
} = require('../controllers/shopController');

const protect = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getShops);

router.post(
  '/',
  protect,
  allowRoles('shop_owner', 'admin'),
  createShop
);

router.post(
  '/books',
  protect,
  allowRoles('shop_owner', 'admin'),
  addShopBook
);

router.patch(
  '/:id/approve',
  protect,
  allowRoles('admin'),
  approveShop
);

module.exports = router;