const Reservation = require('../models/Reservation');
const Book = require('../models/Book');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Reserve a library book
// @route   POST /api/reservations
const reserveBook = asyncHandler(async (req, res) => {
  const { bookId } = req.body;
  const book = await Book.findById(bookId);

  if (!book || book.sourceType !== 'library' || !book.availability) {
    res.status(400);
    throw new Error('Book not available for library reservation');
  }

  const reservation = await Reservation.create({
    student: req.user._id,
    library: book.owner,
    book: bookId
  });

  // Notify Librarian
  await Notification.create({
    user: book.owner,
    type: 'reservation_request',
    title: 'New Library Reservation',
    message: `A student has reserved "${book.title}". Please approve and set a pickup date.`,
    relatedId: reservation._id
  });

  res.status(201).json(reservation);
});

// @desc    Get my reservations (student)
// @route   GET /api/reservations/my-holds
const getMyReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ student: req.user._id })
    .populate('book')
    .populate('library', 'name libraryName locationName')
    .sort({ createdAt: -1 });
  res.json(reservations);
});

// @desc    Get library reservations (librarian)
// @route   GET /api/reservations/library-requests
const getLibraryReservations = asyncHandler(async (req, res) => {
  const reservations = await Reservation.find({ library: req.user._id })
    .populate('book')
    .populate('student', 'name email phone')
    .sort({ createdAt: -1 });
  res.json(reservations);
});

// @desc    Update reservation status (Approve/Reject/Complete)
// @route   PATCH /api/reservations/:id/status
const updateReservationStatus = asyncHandler(async (req, res) => {
  const { status, pickupDate } = req.body;
  const reservation = await Reservation.findById(req.params.id).populate('book');

  if (!reservation) {
    res.status(404);
    throw new Error('Reservation not found');
  }

  // Only librarian can approve/reject
  if (reservation.library.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  reservation.status = status;
  if (pickupDate) reservation.pickupDate = pickupDate;
  await reservation.save();

  // If approved, update book availability
  if (status === 'approved') {
    await Book.findByIdAndUpdate(reservation.book._id, { availability: false });
  }

  // Notify Student
  await Notification.create({
    user: reservation.student,
    type: 'reservation_update',
    title: `Reservation ${status}`,
    message: status === 'approved'
      ? `Your hold on "${reservation.book.title}" is approved! Pickup date: ${new Date(pickupDate).toLocaleDateString()}.`
      : `Your hold on "${reservation.book.title}" was ${status}.`,
    relatedId: reservation._id
  });

  res.json(reservation);
});

module.exports = { reserveBook, getMyReservations, getLibraryReservations, updateReservationStatus };