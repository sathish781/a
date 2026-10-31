const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['student', 'shop', 'library', 'admin'],
      default: 'student'
    },
    phone: { type: String, default: '' },

    // Status and Verification
    status: { type: String, enum: ['active', 'blocked'], default: 'active' },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved' // Students are auto-approved, Shops/Libraries set to pending via controller
    },

    // Location (GeoJSON)
    locationCoords: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] } // [longitude, latitude]
    },
    locationName: { type: String, default: '' },

    // Role-specific Metadata
    college: { type: String, default: '' },
    department: { type: String, default: '' },
    shopName: { type: String, default: '' },
    shopAddress: { type: String, default: '' },
    libraryName: { type: String, default: '' },
    libraryAddress: { type: String, default: '' },
    profileImage: { type: String, default: '' },

    recoveryHint: { type: String, default: '' },

    badgeCount: { type: Number, default: 0 },

    resetPasswordToken: String,
    resetPasswordExpire: Date
  },
  { timestamps: true }
);

userSchema.index({ locationCoords: '2dsphere' });

// Generate and hash password reset token
userSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model('User', userSchema);