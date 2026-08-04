const express = require('express');
const { getNearbyLibraries, getNearbyShops, getNearbyDonations } = require('../controllers/mapsController');

const router = express.Router();

router.get('/nearby-libraries', getNearbyLibraries);
router.get('/nearby-shops', getNearbyShops);
router.get('/nearby-donations', getNearbyDonations);

module.exports = router;
