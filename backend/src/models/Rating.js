const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },

    targetShop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop'
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },

    review: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Rating', ratingSchema);