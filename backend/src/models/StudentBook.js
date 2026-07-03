const mongoose = require('mongoose');

const studentBookSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },

    price: {
      type: Number,
      default: 0
    },

    condition: {
      type: String,
      enum: ['New', 'Good', 'Average', 'Old'],
      default: 'Good'
    },

    listingType: {
      type: String,
      enum: ['sell', 'exchange', 'donate'],
      default: 'sell'
    },

    imageUrl: {
      type: String,
      default: ''
    },

    status: {
      type: String,
      enum: ['available', 'sold', 'exchanged', 'donated'],
      default: 'available'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('StudentBook', studentBookSchema);