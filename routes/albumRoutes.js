const express = require('express');
const albumController = require('../controllers/albumController');

const router = express.Router();

router.get('/', albumController.getAlbums);
router.get('/:id', albumController.getAlbumById);
router.post('/', albumController.createAlbum);
router.put('/:id', albumController.updateAlbum);
router.delete('/:id', albumController.deleteAlbum);

module.exports = router;