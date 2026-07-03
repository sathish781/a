const express = require('express');

const { addShopBook } = require('../controllers/shopController');

const protect = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');

const router = express.Router();

router.post(
  '/',
  protect,
  allowRoles('shop_owner', 'admin'),
  addShopBook
);

module.exports = router;