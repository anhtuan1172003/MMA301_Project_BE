const express = require('express');
const favoriteController = require('../controllers/favoriteController');

const router = express.Router();

router.get('/', favoriteController.getFavorites);
router.get('/:id', favoriteController.getFavoriteById);
router.post('/', favoriteController.createFavorite);
router.delete('/:id', favoriteController.deleteFavorite);

module.exports = router;