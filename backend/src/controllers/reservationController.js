const Reservation = require('../models/Reservation');
const Book = require('../models/Book');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

// @desc  Get my reservations (as student / requester)
// @route GET /api/reservations/my-reservations
const getMyReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ user: req.user._id })
    .populate('book', 'title author isbn imageUrl condition location')
    .populate('owner', 'name email role shopName libraryName college phone')
    .sort({ createdAt: -1 });
  res.json(reservations);
});

// @desc  Get incoming reservation requests (for shop/library owners)
// @route GET /api/reservations/incoming
const getIncomingReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ owner: req.user._id })
    .populate('book', 'title author isbn imageUrl condition')
    .populate('user', 'name email phone college profileImage')
    .sort({ createdAt: -1 });
  res.json(reservations);
});

// @desc  Create a reservation request
// @route POST /api/reservations
const createReservation = asyncHandler(async (req, res) => {
  const { bookId, notes } = req.body;

  if (!bookId) {
    res.status(400);
    throw new Error('Book ID is required.');
  }

  const book = await Book.findById(bookId);
  if (!book) {
    res.status(404);
    throw new Error('Book not found.');
  }

  if (!book.availability) {
    res.status(400);
    throw new Error('This book is not currently available for reservation.');
  }

  const existing = await Reservation.findOne({ book: bookId, user: req.user._id, status: 'pending' });
  if (existing) {
    res.status(400);
    throw new Error('You already have a pending reservation for this book.');
  }

  const reservation = await Reservation.create({
    book: bookId,
    user: req.user._id,
    owner: book.owner,
    notes: notes || '',
    status: 'pending'
  });

  // Notify the book owner
  await Notification.create({
    user: book.owner,
    title: 'New Reservation Request',
    message: `${req.user.name} has requested to reserve your book "${book.title}".`,
    type: 'general',
    data: { reservationId: reservation._id }
  });

  res.status(201).json({ message: 'Reservation request sent.', reservation });
});

// @desc  Accept a reservation request (owner)
// @route PATCH /api/reservations/:id/accept
const acceptReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id)
    .populate('book')
    .populate('user');

  if (!reservation) {
    res.status(404);
    throw new Error('Reservation not found.');
  }

  if (reservation.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized.');
  }

  reservation.status = 'accepted';
  await reservation.save();

  // Mark book as reserved (not available)
  await Book.findByIdAndUpdate(reservation.book._id, { availability: false });

  await Notification.create({
    user: reservation.user._id,
    title: 'Reservation Accepted!',
    message: `Your reservation for "${reservation.book.title}" has been accepted.`,
    type: 'reservation_accepted',
    data: { reservationId: reservation._id }
  });

  res.json({ message: 'Reservation accepted.', reservation });
});

// @desc  Reject a reservation request
// @route PATCH /api/reservations/:id/reject
const rejectReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id)
    .populate('book')
    .populate('user');

  if (!reservation) {
    res.status(404);
    throw new Error('Reservation not found.');
  }

  reservation.status = 'rejected';
  await reservation.save();

  await Notification.create({
    user: reservation.user._id,
    title: 'Reservation Declined',
    message: `Your reservation for "${reservation.book.title}" was declined.`,
    type: 'reservation_rejected',
    data: { reservationId: reservation._id }
  });

  res.json({ message: 'Reservation rejected.', reservation });
});

// @desc  Cancel a reservation (by requester)
// @route PATCH /api/reservations/:id/cancel
const cancelReservation = asyncHandler(async (req, res) => {
  const reservation = await Reservation.findById(req.params.id).populate('book');
  if (!reservation) {
    res.status(404);
    throw new Error('Reservation not found.');
  }

  if (reservation.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized.');
  }

  reservation.status = 'cancelled';
  await reservation.save();

  // Re-make book available
  await Book.findByIdAndUpdate(reservation.book._id, { availability: true });

  res.json({ message: 'Reservation cancelled.', reservation });
});

module.exports = {
  getMyReservations,
  getIncomingReservations,
  createReservation,
  acceptReservation,
  rejectReservation,
  cancelReservation
};