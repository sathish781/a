const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['monthly_donations', 'monthly_exchanges', 'most_sold', 'most_searched', 'most_active_users', 'shop_revenue', 'library_report'],
      required: true
    },
    title: {
      type: String,
      required: true
    },
    data: {
      type: Object,
      required: true
    },
    period: {
      type: String,
      default: 'Overall'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Report', reportSchema);
