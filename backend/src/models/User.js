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
      enum: ['student', 'shop', 'library', 'admin'],
      default: 'student'
    },

    phone: {
      type: String,
      default: ''
    },

    // Student fields
    college: {
      type: String,
      default: ''
    },

    department: {
      type: String,
      default: ''
    },

    isCollegeStudent: {
      type: Boolean,
      default: true
    },

    year: {
      type: String,
      default: ''
    },

    // Shop fields
    shopName: {
      type: String,
      default: ''
    },

    shopAddress: {
      type: String,
      default: ''
    },

    businessDescription: {
      type: String,
      default: ''
    },

    // Library fields
    libraryName: {
      type: String,
      default: ''
    },

    libraryAddress: {
      type: String,
      default: ''
    },

    profileImage: {
      type: String,
      default: ''
    },

    status: {
      type: String,
      enum: ['active', 'blocked', 'deleted'],
      default: 'active'
    },

    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved'
    },

    location: {
      type: String,
      default: 'New York, NY'
    },

    latitude: {
      type: Number,
      default: 40.7128
    },

    longitude: {
      type: Number,
      default: -74.0060
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


userSchema.index({ role: 1 });
userSchema.index({ location: 'text', college: 'text', shopName: 'text', libraryName: 'text' });

module.exports = mongoose.model('User', userSchema);