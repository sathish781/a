const Exchange = require('../models/Exchange');
const StudentBook = require('../models/StudentBook');
const asyncHandler = require('../utils/asyncHandler');
const sendNotification = require('../utils/sendNotification');

const createExchangeRequest = asyncHandler(async (req, res) => {
  const { requestedListingId, offeredListingId, message } = req.body;

  if (!requestedListingId) {
    res.status(400);
    throw new Error('Requested listing ID is required.');
  }

  const requestedListing = await StudentBook.findById(requestedListingId)
    .populate('seller')
    .populate('book');

  if (!requestedListing) {
    res.status(404);
    throw new Error('Requested listing not found.');
  }

  if (requestedListing.seller._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot request exchange for your own book.');
  }

  const exchange = await Exchange.create({
    requester: req.user._id,
    owner: requestedListing.seller._id,
    requestedListing: requestedListingId,
    offeredListing: offeredListingId || null,
    message: message || 'I want to exchange this book.',
    status: 'pending'
  });

  await sendNotification(
    requestedListing.seller._id,
    'New Exchange Request',
    `You received an exchange request for ${requestedListing.book.title}.`
  );

  res.status(201).json({
    message: 'Exchange request sent successfully',
    exchange
  });
});

const getMyExchanges = asyncHandler(async (req, res) => {
  const exchanges = await Exchange.find({
    $or: [
      { requester: req.user._id },
      { owner: req.user._id }
    ]
  })
    .populate('requester', 'name phone email')
    .populate('owner', 'name phone email')
    .populate({
      path: 'requestedListing',
      populate: {
        path: 'book'
      }
    })
    .populate({
      path: 'offeredListing',
      populate: {
        path: 'book'
      }
    })
    .sort({ createdAt: -1 });

  res.json(exchanges);
});

const updateExchangeStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const allowedStatus = ['pending', 'accepted', 'rejected', 'completed'];

  if (!allowedStatus.includes(status)) {
    res.status(400);
    throw new Error('Invalid exchange status.');
  }

  const exchange = await Exchange.findById(req.params.id)
    .populate('requester')
    .populate('owner')
    .populate({
      path: 'requestedListing',
      populate: {
        path: 'book'
      }
    });

  if (!exchange) {
    res.status(404);
    throw new Error('Exchange request not found.');
  }

  if (
    exchange.owner._id.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Only book owner or admin can update exchange request.');
  }

  exchange.status = status;
  await exchange.save();

  if (status === 'completed') {
    await StudentBook.findByIdAndUpdate(exchange.requestedListing._id, {
      status: 'exchanged'
    });
  }

  await sendNotification(
    exchange.requester._id,
    'Exchange Request Updated',
    `Your exchange request for ${exchange.requestedListing.book.title} is ${status}.`
  );

  res.json({
    message: 'Exchange status updated successfully',
    exchange
  });
});

module.exports = {
  createExchangeRequest,
  getMyExchanges,
  updateExchangeStatus
};