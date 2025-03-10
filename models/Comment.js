const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  photoId: { type: Number, required: true },
  userId: { type: Number, required: true },
  text: { type: String, required: true },
  rate: { type: Number, required: true, min: 1, max: 5 }
});

module.exports = mongoose.model('Comment', commentSchema);