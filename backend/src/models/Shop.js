const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: true,
      trim: true
    },
    ownerName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      required: true
    },
    location: {
      type: String,
      default: ''
    },
    profileImage: {
      type: String,
      default: ''
    },
    approval: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    role: {
      type: String,
      default: 'shop'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Shop', shopSchema);