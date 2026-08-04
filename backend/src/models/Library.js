const mongoose = require('mongoose');

const librarySchema = new mongoose.Schema(
  {
    libraryName: {
      type: String,
      required: true,
      trim: true
    },
    librarianName: {
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
    location: {
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
      default: 'library'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Library', librarySchema);