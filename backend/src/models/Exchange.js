const mongoose = require('mongoose');

const exchangeSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    requestedListing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentBook',
      required: true
    },

    offeredListing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentBook'
    },

    message: {
      type: String,
      default: ''
    },

    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Exchange', exchangeSchema);