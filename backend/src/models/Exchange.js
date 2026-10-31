const mongoose = require('mongoose');

const exchangeSchema = new mongoose.Schema(
  {
    requester: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    offeredBook: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    requestedBook: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },

    // Fallback titles in case books are deleted
    requestedBookTitle: { type: String },
    offeredBookTitle: { type: String },

    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exchange', exchangeSchema);