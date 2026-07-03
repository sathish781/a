const Reservation = require('../models/Reservation');
const LibraryBook = require('../models/LibraryBook');
const ShopBook = require('../models/ShopBook');
const asyncHandler = require('../utils/asyncHandler');
const sendNotification = require('../utils/sendNotification');

const createReservation = asyncHandler(async (req, res) => {
  const { sourceType, libraryBookId, shopBookId } = req.body;

  if (!sourceType) {
    res.status(400);
    throw new Error('Reservation source type is required.');
  }

  if (sourceType === 'library') {
    const libraryBook = await LibraryBook.findById(libraryBookId)
      .populate('book')
      .populate('library');

    if (!libraryBook) {
      res.status(404);
      throw new Error('Library book not found.');
    }

    if (libraryBook.availableCopies <= 0) {
      res.status(400);
      throw new Error('Book not available in library.');
    }

    libraryBook.availableCopies -= 1;
    await libraryBook.save();

    const reservation = await Reservation.create({
      user: req.user._id,
      sourceType: 'library',
      libraryBook: libraryBookId,
      status: 'confirmed'
    });

    await sendNotification(
      req.user._id,
      'Library Reservation Confirmed',
      `Your reservation for ${libraryBook.book.title} at ${libraryBook.library.name} is confirmed.`
    );

    return res.status(201).json({
      message: 'Library book reserved successfully',
      reservation
    });
  }

  if (sourceType === 'shop') {
    const shopBook = await ShopBook.findById(shopBookId)
      .populate('book')
      .populate('shop');

    if (!shopBook) {
      res.status(404);
      throw new Error('Shop book not found.');
    }

    if (shopBook.stock <= 0) {
      res.status(400);
      throw new Error('Book not available in shop.');
    }

    const reservation = await Reservation.create({
      user: req.user._id,
      sourceType: 'shop',
      shopBook: shopBookId,
      status: 'confirmed'
    });

    await sendNotification(
      req.user._id,
      'Shop Reservation Confirmed',
      `Your reservation for ${shopBook.book.title} at ${shopBook.shop.name} is confirmed.`
    );

    return res.status(201).json({
      message: 'Shop book reserved successfully',
      reservation
    });
  }

  res.status(400);
  throw new Error('Invalid reservation source.');
});

const getMyReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ user: req.user._id })
    .populate({
      path: 'libraryBook',
      populate: [
        { path: 'book' },
        { path: 'library' }
      ]
    })
    .populate({
      path: 'shopBook',
      populate: [
        { path: 'book' },
        { path: 'shop' }
      ]
    })
    .sort({ createdAt: -1 });

  res.json(reservations);
});

module.exports = {
  createReservation,
  getMyReservations
};