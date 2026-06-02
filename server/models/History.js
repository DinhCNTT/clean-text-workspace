const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'Văn bản chưa đặt tên'
  },
  contentHtml: {
    type: String,
    required: true
  },
  wordCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('History', historySchema);
