const Notification = require('../models/Notification');

async function sendNotification(userId, title, message) {
  await Notification.create({
    user: userId,
    title,
    message
  });
}

module.exports = sendNotification;