const Favorite = require('../models/Favorite');

exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find();
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFavoriteById = async (req, res) => {
  try {
    const favorite = await Favorite.findOne({ _id: req.params.id });
    if (!favorite) return res.status(404).json({ message: 'Favorite not found' });
    res.json(favorite);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createFavorite = async (req, res) => {
  const favorite = new Favorite(req.body);
  try {
    const newFavorite = await favorite.save();
    res.status(201).json(newFavorite);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({ _id: req.params.id });
    if (!favorite) return res.status(404).json({ message: 'Favorite not found' });
    res.json({ message: 'Favorite deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};