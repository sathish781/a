const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: [
        'donation_approved',
        'donation_rejected',
        'exchange_request',
        'exchange_accepted',
        'reservation_accepted',
        'reservation_rejected',
        'book_sold',
        'book_purchased',
        'shop_approved',
        'library_approved',
        'general'
      ],
      default: 'general'
    },
    isRead: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Notification', notificationSchema);