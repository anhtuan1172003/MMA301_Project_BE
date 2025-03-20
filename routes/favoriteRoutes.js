const express = require("express")
const router = express.Router()
const { getFavorites, getFavorite, createFavorite, deleteFavorite, getFavoriteCounts } = require("../controllers/favoriteController")

// Routes for /api/favorites
router.route("/").get(getFavorites).post(createFavorite)

// Route for /api/favorites/count
router.route("/count").get(getFavoriteCounts)

// Routes for /api/favorites/:id
router.route("/:id").get(getFavorite).delete(deleteFavorite)

module.exports = router

