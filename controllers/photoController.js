const Photo = require('../models/Photo');

exports.getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find();
    res.json(photos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findOne({ photoId: req.params.id });
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    res.json(photo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPhoto = async (req, res) => {
  const photo = new Photo(req.body);
  try {
    const newPhoto = await photo.save();
    res.status(201).json(newPhoto);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updatePhoto = async (req, res) => {
  try {
    const photo = await Photo.findOneAndUpdate({ photoId: req.params.id }, req.body, { new: true });
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    res.json(photo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findOneAndDelete({ photoId: req.params.id });
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    res.json({ message: 'Photo deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};