const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  photoId: { type: Number, required: true },
  userId: { type: Number, required: true }
});

module.exports = mongoose.model('Favorite', favoriteSchema);