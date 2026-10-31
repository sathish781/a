const Book = require('../models/Book');
const Donation = require('../models/Donation');
const Notification = require('../models/Notification');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// @desc  Get all approved donations (public)
// @route GET /api/donations
const getDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({
    adminApprovalStatus: 'approved',
    status: 'available'
  })
    .populate({
      path: 'book',
      select: 'title author isbn category imageUrl condition location description',
      match: { title: { $not: /mock|test|placeholder/i } } // Filter out mock titles
    })
    .populate('donor', 'name email phone college location profileImage')
    .sort({ createdAt: -1 });

  // Filter out any donations where the book was filtered out by the match criteria
  const filteredDonations = donations.filter(d => d.book !== null);

  res.json(filteredDonations);
});

// @desc  Create a donation request
// @route POST /api/donations
const createDonation = asyncHandler(async (req, res) => {
  const {
    title, author, isbn, publisher, category, description,
    condition, imageUrl, location, latitude, longitude, notes, pickupLocation
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
    donationStatus: 'pending'
  });

  const donation = await Donation.create({
    book: book._id,
    donor: req.user._id,
    notes: notes || '',
    pickupLocation: pickupLocation || location || req.user.location || '',
    adminApprovalStatus: 'pending',
    status: 'available'
  });

  // Notify admin(s)
  const admins = await User.find({ role: 'admin' }).select('_id');
  for (const admin of admins) {
    await Notification.create({
      user: admin._id,
      title: 'New Donation Request',
      message: `${req.user.name} wants to donate "${title}". Please review.`,
      type: 'general',
      data: { donationId: donation._id }
    });
  }

  res.status(201).json({ message: 'Donation request submitted. Awaiting admin approval.', donation });
});

// @desc  Get my donations
// @route GET /api/donations/my-donations
const getMyDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ donor: req.user._id })
    .populate('book', 'title author isbn category imageUrl condition')
    .populate('recipientLibrary', 'name libraryName')
    .sort({ createdAt: -1 });
  res.json(donations);
});

// @desc  Admin: Approve a donation
// @route PATCH /api/donations/:id/approve
const approveDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id).populate('book').populate('donor');
  if (!donation) {
    res.status(404);
    throw new Error('Donation not found.');
  }

  donation.adminApprovalStatus = 'approved';
  await donation.save();

  await Book.findByIdAndUpdate(donation.book._id, { donationStatus: 'approved' });

  // Notify donor
  await Notification.create({
    user: donation.donor._id,
    title: 'Donation Approved!',
    message: `Your donation of "${donation.book.title}" has been approved. Libraries will be notified.`,
    type: 'donation_approved',
    data: { donationId: donation._id }
  });

  // Notify all libraries
  const libraries = await User.find({ role: 'library', status: 'active' }).select('_id');
  for (const lib of libraries) {
    await Notification.create({
      user: lib._id,
      title: 'Book Donation Available',
      message: `A book "${donation.book.title}" is available for donation. Check the donations section.`,
      type: 'donation_approved',
      data: { donationId: donation._id }
    });
  }

  res.json({ message: 'Donation approved successfully.', donation });
});

// @desc  Admin: Reject a donation
// @route PATCH /api/donations/:id/reject
const rejectDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id).populate('book').populate('donor');
  if (!donation) {
    res.status(404);
    throw new Error('Donation not found.');
  }

  donation.adminApprovalStatus = 'rejected';
  await donation.save();

  await Book.findByIdAndUpdate(donation.book._id, { donationStatus: 'rejected' });

  await Notification.create({
    user: donation.donor._id,
    title: 'Donation Rejected',
    message: `Your donation of "${donation.book.title}" was not approved this time.`,
    type: 'donation_rejected',
    data: { donationId: donation._id }
  });

  res.json({ message: 'Donation rejected.', donation });
});

// @desc  Admin: Delete a donation
// @route DELETE /api/donations/:id
const deleteDonation = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id);
  if (!donation) {
    res.status(404);
    throw new Error('Donation not found.');
  }
  await donation.deleteOne();
  res.json({ message: 'Donation deleted.' });
});

// @desc  All donations (admin)
// @route GET /api/donations/all
const getAllDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find()
    .populate('book', 'title author isbn category imageUrl condition')
    .populate('donor', 'name email college')
    .sort({ createdAt: -1 });
  res.json(donations);
});

// @desc  Claim a donation (Student requests)
// @route POST /api/donations/request
const requestDonation = asyncHandler(async (req, res) => {
  const { donationId } = req.body;
  const donation = await Donation.findById(donationId).populate('book').populate('donor');

  if (!donation || donation.status !== 'available') {
    res.status(400);
    throw new Error('Donation no longer available');
  }

  // Set to pending_claim so donor can approve/reject
  donation.status = 'pending_claim';
  donation.recipientStudent = req.user._id;
  await donation.save();

  // Mark book as pending in the meantime
  await Book.findByIdAndUpdate(donation.book._id, { donationStatus: 'pending_claim' });

  // Notify Donor
  await Notification.create({
    user: donation.donor._id,
    type: 'donation_request',
    title: '🎁 Someone wants your book!',
    message: `${req.user.name} has requested your donated book "${donation.book.title}". Please Accept or Reject in My Donations.`,
    data: { donationId: donation._id }
  });

  res.json({ message: 'Donation claim request sent. Waiting for donor approval.', donation });
});

// @desc  Donor accepts a claim request
// @route PATCH /api/donations/:id/accept-claim
const acceptDonationClaim = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id).populate('book').populate('recipientStudent');

  if (!donation) {
    res.status(404);
    throw new Error('Donation not found');
  }

  if (donation.donor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the donor can accept this claim');
  }

  donation.status = 'claimed';
  await donation.save();

  // Mark book as completely unavailable
  await Book.findByIdAndUpdate(donation.book._id, {
    availability: false,
    donationStatus: 'donated',
    owner: donation.recipientStudent._id // Transfer ownership? Usually for donation we just mark it donated.
  });

  // Notify Student
  await Notification.create({
    user: donation.recipientStudent._id,
    type: 'donation_accepted',
    title: '🎉 Donation Claim Accepted!',
    message: `The donor has accepted your claim for "${donation.book.title}". You can now coordinate pickup!`,
    data: { donationId: donation._id }
  });

  res.json({ message: 'Claim request accepted.', donation });
});

// @desc  Donor rejects a claim request
// @route PATCH /api/donations/:id/reject-claim
const rejectDonationClaim = asyncHandler(async (req, res) => {
  const donation = await Donation.findById(req.params.id).populate('book').populate('recipientStudent');

  if (!donation) {
    res.status(404);
    throw new Error('Donation not found');
  }

  if (donation.donor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the donor can reject this claim');
  }

  const studentName = donation.recipientStudent?.name || 'A student';
  const bookTitle = donation.book?.title || 'the book';

  // Make it available again
  donation.status = 'available';
  donation.recipientStudent = null;
  await donation.save();

  await Book.findByIdAndUpdate(donation.book._id, {
    availability: true,
    donationStatus: 'approved'
  });

  // Notify Student
  await Notification.create({
    user: req.body.recipientId || donation.recipientStudent?._id, // fallback
    type: 'donation_rejected',
    title: 'Donation Claim Declined',
    message: `Your request for "${bookTitle}" was declined by the donor.`,
    data: { donationId: donation._id }
  });

  res.json({ message: 'Claim request rejected. Book is available again.', donation });
});

// @desc  Get donations claimed by me
// @route GET /api/donations/my-claims
const getMyClaims = asyncHandler(async (req, res) => {
  const claims = await Donation.find({ recipientStudent: req.user._id })
    .populate('book', 'title author isbn category imageUrl condition description')
    .populate('donor', 'name email phone college location profileImage')
    .sort({ createdAt: -1 });
  res.json(claims);
});

module.exports = {
  getDonations,
  createDonation,
  getMyDonations,
  approveDonation,
  rejectDonation,
  deleteDonation,
  getAllDonations,
  requestDonation,
  acceptDonationClaim,
  rejectDonationClaim,
  getMyClaims
};
