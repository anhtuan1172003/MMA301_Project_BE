const Favorite = require('../models/Favorite');

// Lấy tất cả yêu thích
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find();
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy yêu thích bằng _id
exports.getFavoriteById = async (req, res) => {
  try {
    const favorite = await Favorite.findById(req.params.id);
    if (!favorite) return res.status(404).json({ message: 'Favorite not found' });
    res.json(favorite);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo yêu thích mới
exports.createFavorite = async (req, res) => {
  const favorite = new Favorite(req.body);
  try {
    const newFavorite = await favorite.save();
    res.status(201).json(newFavorite);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa yêu thích bằng _id
exports.deleteFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findByIdAndDelete(req.params.id);
    if (!favorite) return res.status(404).json({ message: 'Favorite not found' });
    res.json({ message: 'Favorite deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};