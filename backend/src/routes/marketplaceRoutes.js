const express = require('express');
const {
  getMarketplaceListings,
  getMyListings,
  createMarketplaceListing,
  createBuyRequest,
  acceptBuyRequest,
  rejectBuyRequest,
  getMyPurchases,
  getMySales,
  updateMarketplaceListing,
  deleteMarketplaceListing
} = require('../controllers/marketplaceController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getMarketplaceListings);
router.get('/my-listings', protect, getMyListings);
router.get('/my-purchases', protect, getMyPurchases);
router.get('/my-sales', protect, getMySales);
router.post('/', protect, createMarketplaceListing);
router.post('/:id/request', protect, createBuyRequest);
router.patch('/orders/:id/accept', protect, acceptBuyRequest);
router.patch('/orders/:id/reject', protect, rejectBuyRequest);
router.put('/:id', protect, updateMarketplaceListing);
router.delete('/:id', protect, deleteMarketplaceListing);

module.exports = router;
