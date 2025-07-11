
const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: { type: Date, default: Date.now },
  category: String,
  tags: [String],
  image: String, 
});

module.exports = mongoose.model('Blog', contentSchema);
