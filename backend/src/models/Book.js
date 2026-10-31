const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, default: 'Unknown Author', trim: true },
    isbn: { type: String, default: '', trim: true },
    publisher: { type: String, default: '' },
    edition: { type: String, default: '' },
    category: { type: String, default: 'Academic' },
    subjectCode: { type: String, default: '' },
    language: { type: String, default: 'English' },
    description: { type: String, default: '' },
    condition: {
      type: String,
      enum: ['New', 'Like New', 'Good', 'Fair'],
      default: 'Good'
    },
    price: { type: Number, default: 0 },
    imageUrl: { type: String, default: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c' },

    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['admin', 'student', 'shop', 'library'], default: 'student' },
    sourceType: {
      type: String,
      enum: ['library', 'shop', 'student'],
      required: false, // Changed to false to avoid validation crashes
      default: 'student'
    },

    // Listing Logic
    listingType: {
      type: String,
      enum: ['sell', 'exchange', 'donate', 'library_borrow'],
      default: 'sell'
    },

    // Smart Matching for Exchange
    wantsInExchange: { type: String, default: '' }, // Search string for matching
    exchangeStatus: {
      type: String,
      enum: ['none', 'available', 'pending', 'exchanged'],
      default: 'none'
    },

    // Statuses
    availability: { type: Boolean, default: true },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },

    // Redundant location for faster search
    locationCoords: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }
    }
  },
  { timestamps: true }
);

bookSchema.index({ locationCoords: '2dsphere' });
bookSchema.index({ title: 'text', author: 'text', isbn: 'text', category: 'text' });

module.exports = mongoose.model('Book', bookSchema);