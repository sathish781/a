const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');

const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({
    user: req.user._id
  }).sort({ createdAt: -1 });

  res.json(notifications);
});

const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id
    },
    {
      isRead: true
    },
    {
      new: true
    }
  );

  if (!notification) {
    res.status(404);
    throw new Error('Notification not found.');
  }

  res.json({
    message: 'Notification marked as read',
    notification
  });
});

module.exports = {
  getNotifications,
  markNotificationRead
};