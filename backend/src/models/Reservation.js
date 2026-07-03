const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    sourceType: {
      type: String,
      enum: ['library', 'shop'],
      required: true
    },

    libraryBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LibraryBook'
    },

    shopBook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ShopBook'
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'collected'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Reservation', reservationSchema);