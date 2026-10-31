const mongoose = require('mongoose');

const libraryRequestSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    libraryId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The Librarian/Library user
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    requestedDays: { type: Number, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED', 'BORROWED', 'RETURNED', 'OVERDUE'],
      default: 'PENDING'
    },
    requestDate: { type: Date, default: Date.now },
    approvedDate: { type: Date },
    borrowDate: { type: Date },
    dueDate: { type: Date },
    returnDate: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('LibraryRequest', libraryRequestSchema);