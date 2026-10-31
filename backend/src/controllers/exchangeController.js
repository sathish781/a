const Book = require('../models/Book');
const Exchange = require('../models/Exchange');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

// @desc  Get available exchange books from other students
// @route GET /api/exchanges
const getExchanges = asyncHandler(async (req, res) => {
  // Return all books listed as available for exchange
  const books = await Book.find({
    listingType: 'exchange',
    availability: true
    // owner filter removed so you can see your own listings for testing/verification
  })
    .populate('owner', 'name email phone college location profileImage')
    .sort({ createdAt: -1 });
  res.json(books);
});

// @desc  List my book for exchange
// @route POST /api/exchanges/list
const listBookForExchange = asyncHandler(async (req, res) => {
  const {
    title, author, isbn, publisher, category, description,
    condition, imageUrl, location, latitude, longitude
  } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Book title is required.');
  }

  const book = await Book.create({
    title,
    author: author || 'Unknown Author',
    isbn: isbn || '',
    publisher: publisher || '',
    category: category || 'General',
    description: description || '',
    condition: condition || 'Good',
    price: 0,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60',
    owner: req.user._id,
    role: req.user.role,
    location: location || req.user.location || '',
    latitude: latitude || req.user.latitude,
    longitude: longitude || req.user.longitude,
    availability: true,
    exchangeStatus: 'available'
  });

  res.status(201).json({ message: 'Book listed for exchange.', book });
});

// @desc  Create an exchange request
// @route POST /api/exchanges/request
const createExchangeRequest = asyncHandler(async (req, res) => {
  const { requestedBookId, offeredBookId, message } = req.body;

  if (!requestedBookId || !offeredBookId) {
    res.status(400);
    throw new Error('Both requested and offered book IDs are required.');
  }

  const requestedBook = await Book.findById(requestedBookId).populate('owner');
  const offeredBook = await Book.findById(offeredBookId);

  if (!requestedBook || !offeredBook) {
    res.status(404);
    throw new Error('One or both books not found.');
  }

  if (offeredBook.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only offer books that you own.');
  }

  const exchange = await Exchange.create({
    requester: req.user._id,
    requestedBook: requestedBookId,
    requestedBookTitle: requestedBook.title, // Fixed: ensure titles are saved
    targetUser: requestedBook.owner._id,
    offeredBook: offeredBookId,
    offeredBookTitle: offeredBook.title, // Fixed: ensure titles are saved
    message: message || '',
    status: 'pending'
  });

  // Notify the target student
  await Notification.create({
    user: requestedBook.owner._id,
    title: '📩 New Book Swap Request!',
    message: `${req.user.name} wants to swap "${offeredBook.title}" for your book "${requestedBook.title}".`,
    type: 'exchange_request',
    data: { exchangeId: exchange._id }
  });

  res.status(201).json({ message: 'Exchange request sent successfully.', exchange });
});

// @desc  Accept an exchange request
// @route PATCH /api/exchanges/:id/accept
const acceptExchange = asyncHandler(async (req, res) => {
  const exchange = await Exchange.findById(req.params.id)
    .populate('requestedBook')
    .populate('offeredBook')
    .populate('requester');

  if (!exchange) {
    res.status(404);
    throw new Error('Exchange request not found.');
  }

  if (exchange.targetUser.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to accept this exchange.');
  }

  exchange.status = 'accepted';
  await exchange.save();

  // Swap book owners & mark exchanged
  if (exchange.requestedBook) {
    await Book.findByIdAndUpdate(exchange.requestedBook._id, {
      owner: exchange.requester._id,
      exchangeStatus: 'exchanged',
      availability: false
    });
  }

  if (exchange.offeredBook) {
    await Book.findByIdAndUpdate(exchange.offeredBook._id, {
      owner: req.user._id,
      exchangeStatus: 'exchanged',
      availability: false
    });
  }

  // 1. Notify requester (Student A)
  await Notification.create({
    user: exchange.requester._id,
    title: '🎉 Exchange Accepted & Books Swapped!',
    message: `${req.user.name} accepted your swap request! You have received "${exchange.requestedBook?.title || 'the book'}".`,
    type: 'exchange_accepted',
    data: { exchangeId: exchange._id }
  });

  // 2. Notify acceptor (Student B)
  await Notification.create({
    user: req.user._id,
    title: '✅ Book Swap Completed!',
    message: `You accepted the swap request with ${exchange.requester?.name || 'the student'}. You received "${exchange.offeredBook?.title || 'the book'}".`,
    type: 'exchange_accepted',
    data: { exchangeId: exchange._id }
  });

  res.json({ message: 'Exchange accepted! Books have been swapped successfully.', exchange });
});

// @desc  Reject an exchange request
// @route PATCH /api/exchanges/:id/reject
const rejectExchange = asyncHandler(async (req, res) => {
  const exchange = await Exchange.findById(req.params.id).populate('requestedBook').populate('requester');
  if (!exchange) {
    res.status(404);
    throw new Error('Exchange request not found.');
  }

  exchange.status = 'rejected';
  await exchange.save();

  await Notification.create({
    user: exchange.requester._id,
    title: 'Exchange Declined',
    message: `Your exchange request for "${exchange.requestedBook.title}" was declined.`,
    type: 'general',
    data: { exchangeId: exchange._id }
  });

  res.json({ message: 'Exchange rejected.', exchange });
});

// @desc  Get my exchange requests (as requester or target)
// @route GET /api/exchanges/my-exchanges
const getMyExchanges = asyncHandler(async (req, res) => {
  const exchanges = await Exchange.find({
    $or: [{ requester: req.user._id }, { targetUser: req.user._id }]
  })
    .populate('requestedBook', 'title author isbn imageUrl condition')
    .populate('offeredBook', 'title author isbn imageUrl condition')
    .populate('requester', 'name email college location profileImage')
    .populate('targetUser', 'name email college location profileImage')
    .sort({ createdAt: -1 });

  res.json(exchanges);
});

// @desc  Admin: Get all exchanges
// @route GET /api/exchanges/all
const getAllExchanges = asyncHandler(async (req, res) => {
  const exchanges = await Exchange.find()
    .populate('requestedBook', 'title author isbn imageUrl')
    .populate('offeredBook', 'title author isbn imageUrl')
    .populate('requester', 'name email')
    .populate('targetUser', 'name email')
    .sort({ createdAt: -1 });
  res.json(exchanges);
});

// @desc  Find automated exchange matches
// @route GET /api/exchanges/matches
const findExchangeMatches = asyncHandler(async (req, res) => {
  // Find books I have that others want, AND books others have that I want
  const myBooks = await Book.find({ owner: req.user._id, listingType: 'exchange' });

  if (!myBooks.length) {
    return res.json([]);
  }

  const matches = [];

  for (const myBook of myBooks) {
    // 1. Find people who want my book
    const interestedParties = await Book.find({
      owner: { $ne: req.user._id },
      listingType: 'exchange',
      wantsInExchange: { $regex: myBook.title, $options: 'i' }
    }).populate('owner', 'name email locationName');

    for (const partnerBook of interestedParties) {
      // 2. Check if I want what they have
      if (myBook.wantsInExchange && partnerBook.title.toLowerCase().includes(myBook.wantsInExchange.toLowerCase())) {
        matches.push({
          myBook,
          partnerBook,
          partner: partnerBook.owner,
          matchType: '🎯 Direct Match'
        });
      }
    }
  }

  res.json(matches);
});

module.exports = {
  getExchanges,
  listBookForExchange,
  createExchangeRequest,
  acceptExchange,
  rejectExchange,
  getMyExchanges,
  getAllExchanges,
  findExchangeMatches
};
