const Donation = require('../models/Donation');
const StudentBook = require('../models/StudentBook');
const asyncHandler = require('../utils/asyncHandler');
const sendNotification = require('../utils/sendNotification');

const getDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find()
    .populate('donor', 'name email phone college location badgeCount')
    .populate('receiver', 'name email phone college location')
    .populate({
      path: 'listing',
      populate: {
        path: 'book'
      }
    })
    .sort({ createdAt: -1 });

  res.json(donations);
});

const requestDonation = asyncHandler(async (req, res) => {
  const { donationId } = req.body;

  if (!donationId) {
    res.status(400);
    throw new Error('Donation ID is required.');
  }

  const donation = await Donation.findById(donationId)
    .populate('donor')
    .populate({
      path: 'listing',
      populate: {
        path: 'book'
      }
    });

  if (!donation) {
    res.status(404);
    throw new Error('Donation not found.');
  }

  if (donation.status !== 'available') {
    res.status(400);
    throw new Error('Donation is not available now.');
  }

  if (donation.donor._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot request your own donated book.');
  }

  donation.receiver = req.user._id;
  donation.status = 'requested';
  await donation.save();

  await sendNotification(
    donation.donor._id,
    'Donation Request',
    `A student requested your donated book ${donation.listing.book.title}.`
  );

  res.json({
    message: 'Donation request sent successfully',
    donation
  });
});

const updateDonationStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const allowedStatus = ['available', 'requested', 'approved', 'completed'];

  if (!allowedStatus.includes(status)) {
    res.status(400);
    throw new Error('Invalid donation status.');
  }

  const donation = await Donation.findById(req.params.id)
    .populate('receiver')
    .populate({
      path: 'listing',
      populate: {
        path: 'book'
      }
    });

  if (!donation) {
    res.status(404);
    throw new Error('Donation not found.');
  }

  if (
    donation.donor.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Only donor or admin can update donation.');
  }

  donation.status = status;
  await donation.save();

  if (status === 'completed') {
    await StudentBook.findByIdAndUpdate(donation.listing._id, {
      status: 'donated'
    });
  }

  if (donation.receiver) {
    await sendNotification(
      donation.receiver._id,
      'Donation Status Updated',
      `Your donation request for ${donation.listing.book.title} is ${status}.`
    );
  }

  res.json({
    message: 'Donation updated successfully',
    donation
  });
});

module.exports = {
  getDonations,
  requestDonation,
  updateDonationStatus
};