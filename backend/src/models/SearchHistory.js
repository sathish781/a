const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    query: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
