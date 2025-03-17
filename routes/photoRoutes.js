const express = require('express');
const photoController = require('../controllers/photoController');

const router = express.Router();

router.get('/', photoController.getPhotos);
router.get('/:id', photoController.getPhotoById);
router.post('/', photoController.createPhoto);
router.put('/:id', photoController.updatePhoto);
router.delete('/:id', photoController.deletePhoto);

module.exports = router;