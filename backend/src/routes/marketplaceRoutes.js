const express = require('express');

const {
  getMarketplaceListings,
  createMarketplaceListing,
  updateMarketplaceListing,
  deleteMarketplaceListing
} = require('../controllers/marketplaceController');

const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getMarketplaceListings);
router.post('/', protect, createMarketplaceListing);
router.put('/:id', protect, updateMarketplaceListing);
router.delete('/:id', protect, deleteMarketplaceListing);

module.exports = router;