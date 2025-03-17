const express = require("express")
const router = express.Router()
const { getAlbums, getAlbum, createAlbum, updateAlbum, deleteAlbum } = require("../controllers/albumController")

// Routes for /api/albums
router.route("/").get(getAlbums).post(createAlbum)

// Routes for /api/albums/:id
router.route("/:id").get(getAlbum).put(updateAlbum).delete(deleteAlbum)

module.exports = router

