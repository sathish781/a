const express = require('express');

const { addShopBook } = require('../controllers/shopController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post(
  '/',
  protect,
  authorize('shop', 'admin'),
  addShopBook
);

module.exports = router;

