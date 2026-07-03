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
      default: ''
    },

    isbn: {
      type: String,
      default: ''
    },

    category: {
      type: String,
      default: ''
    },

    subject: {
      type: String,
      default: ''
    },

    course: {
      type: String,
      default: ''
    },

    semester: {
      type: String,
      default: ''
    },

    examType: {
      type: String,
      default: 'Academic'
    },

    description: {
      type: String,
      default: ''
    },

    imageUrl: {
      type: String,
      default: ''
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
  subject: 'text',
  course: 'text',
  semester: 'text',
  examType: 'text'
});

module.exports = mongoose.model('Book', bookSchema);