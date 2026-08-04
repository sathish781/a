const express = require('express');
const {
  getMarketplaceListings,
  getMyListings,
  createMarketplaceListing,
  buyBook,
  updateMarketplaceListing,
  deleteMarketplaceListing
} = require('../controllers/marketplaceController');

const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/', getMarketplaceListings);
router.get('/my-listings', protect, getMyListings);
router.post('/', protect, createMarketplaceListing);
router.post('/:id/buy', protect, buyBook);
router.put('/:id', protect, updateMarketplaceListing);
router.delete('/:id', protect, deleteMarketplaceListing);

module.exports = router;
