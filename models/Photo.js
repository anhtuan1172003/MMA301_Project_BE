const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  photoId: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  image: {
    url: { type: [String], required: true },
    thumbnail: { type: String, required: true }
  },
  albumId: { type: Number, default: null },
  tags: { type: [String], default: [] },
  likes: { type: Number, default: 0 }
});

module.exports = mongoose.model('Photo', photoSchema);