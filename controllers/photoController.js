const Photo = require('../models/Photo');

// Lấy tất cả ảnh
exports.getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find();
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy ảnh bằng _id
exports.getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    res.json(photo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo ảnh mới
exports.createPhoto = async (req, res) => {
  const photo = new Photo(req.body);
  try {
    const newPhoto = await photo.save();
    res.status(201).json(newPhoto);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật ảnh bằng _id
exports.updatePhoto = async (req, res) => {
  try {
    const photo = await Photo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    res.json(photo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa ảnh bằng _id
exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findByIdAndDelete(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    res.json({ message: 'Photo deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};