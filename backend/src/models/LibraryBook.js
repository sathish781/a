const mongoose = require('mongoose');

const libraryBookSchema = new mongoose.Schema(
  {
    library: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Library',
      required: true
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },

    totalCopies: {
      type: Number,
      default: 0
    },

    availableCopies: {
      type: Number,
      default: 0
    },

    shelfNumber: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('LibraryBook', libraryBookSchema);