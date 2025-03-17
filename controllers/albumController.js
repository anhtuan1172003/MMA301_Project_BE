const Album = require('../models/Album');

// Lấy tất cả album
exports.getAlbums = async (req, res) => {
  try {
    const albums = await Album.find();
    res.json(albums);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy album bằng _id
exports.getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (!album) return res.status(404).json({ message: 'Album not found' });
    res.json(album);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo album mới
exports.createAlbum = async (req, res) => {
  const album = new Album(req.body);
  try {
    const newAlbum = await album.save();
    res.status(201).json(newAlbum);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật album bằng _id
exports.updateAlbum = async (req, res) => {
  try {
    const album = await Album.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!album) return res.status(404).json({ message: 'Album not found' });
    res.json(album);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa album bằng _id
exports.deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findByIdAndDelete(req.params.id);
    if (!album) return res.status(404).json({ message: 'Album not found' });
    res.json({ message: 'Album deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};