const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    author: {
      type: String,
      default: 'Unknown Author',
      trim: true
    },

    isbn: {
      type: String,
      default: '',
      trim: true
    },

    publisher: {
      type: String,
      default: ''
    },

    category: {
      type: String,
      default: 'General'
    },

    description: {
      type: String,
      default: ''
    },

    condition: {
      type: String,
      enum: ['New', 'Like New', 'Good', 'Fair'],
      default: 'Good'
    },

    price: {
      type: Number,
      default: 0
    },

    images: [
      {
        type: String
      }
    ],

    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60'
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    role: {
      type: String,
      enum: ['student', 'shop', 'library', 'admin'],
      default: 'student'
    },

    location: {
      type: String,
      default: 'Main Campus'
    },

    latitude: {
      type: Number,
      default: 40.7128
    },

    longitude: {
      type: Number,
      default: -74.0060
    },

    availability: {
      type: Boolean,
      default: true
    },

    donationStatus: {
      type: String,
      enum: ['none', 'pending', 'approved', 'rejected', 'donated'],
      default: 'none'
    },

    exchangeStatus: {
      type: String,
      enum: ['none', 'available', 'pending', 'exchanged'],
      default: 'none'
    },

    publishedDate: {
      type: String,
      default: ''
    },

    previewLink: {
      type: String,
      default: ''
    },

    marketplaceStatus: {
      type: String,
      enum: ['none', 'pending', 'approved', 'rejected', 'sold'],
      default: 'none'
    }
  },
  {
    timestamps: true
  }
);

bookSchema.index({
  title: 'text',
  author: 'text',
  isbn: 'text',
  category: 'text',
  publisher: 'text',
  location: 'text'
});

module.exports = mongoose.model('Book', bookSchema);