const mongoose = require('mongoose');

const marketplaceSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    condition: {
      type: String,
      enum: ['New', 'Like New', 'Good', 'Fair'],
      default: 'Good'
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved'
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'removed'],
      default: 'available'
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Marketplace', marketplaceSchema);
