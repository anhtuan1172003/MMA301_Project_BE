const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  albumId: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  userId: { type: Number, required: true }
});

module.exports = mongoose.model('Album', albumSchema);