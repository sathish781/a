const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
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

    role: {
      type: String,
      enum: ['student', 'library_staff', 'shop_owner', 'admin'],
      default: 'student'
    },

    phone: {
      type: String,
      default: ''
    },

    college: {
      type: String,
      default: ''
    },

    location: {
      type: String,
      default: ''
    },

    badgeCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);