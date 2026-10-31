const express = require('express');
const { createOrder, getMyOrders, getReceivedOrders, updateOrderStatus } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/sales', getReceivedOrders);
router.patch('/:id/status', updateOrderStatus);

module.exports = router;