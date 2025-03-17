const express = require("express")
const router = express.Router()
const { getFavorites, getFavorite, createFavorite, deleteFavorite } = require("../controllers/favoriteController")

// Routes for /api/favorites
router.route("/").get(getFavorites).post(createFavorite)

// Routes for /api/favorites/:id
router.route("/:id").get(getFavorite).delete(deleteFavorite)

module.exports = router

