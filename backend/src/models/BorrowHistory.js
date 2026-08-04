const mongoose = require('mongoose');

const borrowHistorySchema = new mongoose.Schema(
  {
    library: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: true
    },
    borrowDate: {
      type: Date,
      default: Date.now
    },
    dueDate: {
      type: Date,
      default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    },
    returnDate: {
      type: Date
    },
    status: {
      type: String,
      enum: ['borrowed', 'returned', 'overdue'],
      default: 'borrowed'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('BorrowHistory', borrowHistorySchema);
