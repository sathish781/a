const mongoose = require('mongoose');

const shopRequestSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The Shop Owner user
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING'
    },
    requestDate: { type: Date, default: Date.now },
    acceptedDate: { type: Date },
    completedDate: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('ShopRequest', shopRequestSchema);