const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    recipientLibrary: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    recipientStudent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    adminApprovalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    status: {
      type: String,
      enum: ['available', 'claimed', 'completed'],
      default: 'available'
    },
    pickupLocation: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Donation', donationSchema);