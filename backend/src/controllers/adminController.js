const User = require('../models/User');
const Book = require('../models/Book');
const Donation = require('../models/Donation');
const Exchange = require('../models/Exchange');
const Order = require('../models/Order');
const LibraryRequest = require('../models/LibraryRequest');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const bcrypt = require('bcryptjs');

// @desc  Admin Dashboard Stats
// @route GET /api/admin/stats
const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalStudents,
    totalShops,
    totalLibraries,
    totalBooks,
    totalDonations,
    totalExchanges,
    pendingShops,
    pendingLibraries,
    pendingDonations
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'shop' }),
    User.countDocuments({ role: 'library' }),
    Book.countDocuments(),
    Donation.countDocuments(),
    Exchange.countDocuments(),
    User.countDocuments({ role: 'shop', approvalStatus: 'pending' }),
    User.countDocuments({ role: 'library', approvalStatus: 'pending' }),
    Donation.countDocuments({ adminApprovalStatus: 'pending' })
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayUsers = await User.countDocuments({ createdAt: { $gte: today } });
  const todayBooks = await Book.countDocuments({ createdAt: { $gte: today } });
  const todayDonations = await Donation.countDocuments({ createdAt: { $gte: today } });

  res.json({
    totalUsers,
    totalStudents,
    totalShops,
    totalLibraries,
    totalBooks,
    totalDonations,
    totalExchanges,
    pendingShops,
    pendingLibraries,
    pendingDonations,
    todayActivity: {
      newUsers: todayUsers,
      newBooks: todayBooks,
      newDonations: todayDonations
    }
  });
});

// @desc  Check for overdue library books and notify students
// @route POST /api/admin/check-overdue
const checkLibraryOverdue = asyncHandler(async (req, res) => {
  const now = new Date();

  // Find all active loans that are past their due date
  const overdueLoans = await LibraryRequest.find({
    status: 'BORROWED',
    dueDate: { $lt: now }
  }).populate('studentId').populate('bookId');

  const notifications = [];

  for (const loan of overdueLoans) {
    // Mark as OVERDUE in database
    loan.status = 'OVERDUE';
    await loan.save();

    // Create alert for student
    notifications.push({
      user: loan.studentId._id,
      title: '🚨 OVERDUE BOOK ALERT',
      message: `Your loan for "${loan.bookId.title}" is overdue. Please return it to the library immediately to avoid penalties.`,
      type: 'general'
    });
  }

  if (notifications.length > 0) {
    await Notification.insertMany(notifications);
  }

  res.json({ message: `System scan complete. Found and notified ${overdueLoans.length} overdue loans.` });
});

// @desc  Get all users (admin)
// @route GET /api/admin/users
const getAllUsers = asyncHandler(async (req, res) => {
  const { role = '', status = '' } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (status) filter.status = status;

  const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// @desc  Block / Unblock a user
// @route PATCH /api/admin/users/:id/block
const blockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }
  user.status = user.status === 'blocked' ? 'active' : 'blocked';
  await user.save();
  res.json({ message: `User ${user.status === 'blocked' ? 'blocked' : 'unblocked'} successfully.`, user });
});

// @desc  Delete a user
// @route DELETE /api/admin/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }
  if (user.role === 'admin') {
    res.status(403);
    throw new Error('Cannot delete admin user.');
  }
  await user.deleteOne();
  res.json({ message: 'User deleted successfully.' });
});

// @desc  Reset a user's password (admin)
// @route PATCH /api/admin/users/:id/reset-password
const resetUserPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    res.status(400);
    throw new Error('New password must be at least 6 characters.');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ message: 'Password reset successfully.' });
});

// @desc  Assign role to a user
// @route PATCH /api/admin/users/:id/role
const assignRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['student', 'shop', 'library', 'admin'].includes(role)) {
    res.status(400);
    throw new Error('Invalid role.');
  }

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found.');
  }
  res.json({ message: 'Role assigned.', user });
});

// @desc  Admin: approve / reject shop
// @route PATCH /api/admin/shops/:id/:action
const manageShopApproval = asyncHandler(async (req, res) => {
  const { action } = req.params;
  const approvalStatus = action === 'approve' ? 'approved' : 'rejected';

  const shop = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'shop' },
    { approvalStatus },
    { new: true }
  ).select('-password');

  if (!shop) {
    res.status(404);
    throw new Error('Shop not found.');
  }

  await Notification.create({
    user: shop._id,
    title: action === 'approve' ? 'Shop Approved!' : 'Shop Application Rejected',
    message: action === 'approve'
      ? 'Your shop has been approved by admin. You can now list books!'
      : 'Your shop application was rejected. Contact admin for more info.',
    type: 'shop_approved'
  });

  res.json({ message: `Shop ${action}d successfully.`, shop });
});

// @desc  Admin: approve / reject library
// @route PATCH /api/admin/libraries/:id/:action
const manageLibraryApproval = asyncHandler(async (req, res) => {
  const { action } = req.params;
  const approvalStatus = action === 'approve' ? 'approved' : 'rejected';

  const library = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'library' },
    { approvalStatus },
    { new: true }
  ).select('-password');

  if (!library) {
    res.status(404);
    throw new Error('Library not found.');
  }

  await Notification.create({
    user: library._id,
    title: action === 'approve' ? 'Library Approved!' : 'Library Application Rejected',
    message: action === 'approve'
      ? 'Your library has been approved by admin!'
      : 'Your library application was rejected. Contact admin.',
    type: 'library_approved'
  });

  res.json({ message: `Library ${action}d.`, library });
});

// @desc  Admin: Get all books
// @route GET /api/admin/books
const getAllBooks = asyncHandler(async (req, res) => {
  const books = await Book.find()
    .populate('owner', 'name email role shopName libraryName college')
    .sort({ createdAt: -1 });
  res.json(books);
});

// @desc  Admin: Delete a book
// @route DELETE /api/admin/books/:id
const adminDeleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('Book not found.');
  }
  res.json({ message: 'Book deleted by admin.' });
});

// @desc  Send global announcement to all users
// @route POST /api/admin/announcement
const sendGlobalAnnouncement = asyncHandler(async (req, res) => {
  const { title, message } = req.body;
  if (!title || !message) {
    res.status(400);
    throw new Error('Title and message are required.');
  }

  const users = await User.find({}).select('_id');

  const notifications = users.map(u => ({
    user: u._id,
    title: `📢 Announcement: ${title}`,
    message,
    type: 'general'
  }));

  await Notification.insertMany(notifications);

  res.json({ message: `Announcement sent to ${users.length} users.` });
});

module.exports = {
  getDashboardStats,
  getAllUsers,
  blockUser,
  deleteUser,
  resetUserPassword,
  assignRole,
  manageShopApproval,
  manageLibraryApproval,
  getAllBooks,
  adminDeleteBook,
  sendGlobalAnnouncement,
  checkLibraryOverdue
};
