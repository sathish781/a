const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, trim: true },
    messageType: { type: String, enum: ['text', 'image', 'audio'], default: 'text' },
    fileUrl: { type: String },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);