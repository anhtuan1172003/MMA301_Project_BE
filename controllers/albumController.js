const Album = require('../models/Album');

exports.getAlbums = async (req, res) => {
  try {
    const albums = await Album.find();
    res.json(albums);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAlbumById = async (req, res) => {
  try {
    const album = await Album.findOne({ albumId: req.params.id });
    if (!album) return res.status(404).json({ message: 'Album not found' });
    res.json(album);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createAlbum = async (req, res) => {
  const album = new Album(req.body);
  try {
    const newAlbum = await album.save();
    res.status(201).json(newAlbum);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateAlbum = async (req, res) => {
  try {
    const album = await Album.findOneAndUpdate({ albumId: req.params.id }, req.body, { new: true });
    if (!album) return res.status(404).json({ message: 'Album not found' });
    res.json(album);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findOneAndDelete({ albumId: req.params.id });
    if (!album) return res.status(404).json({ message: 'Album not found' });
    res.json({ message: 'Album deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};