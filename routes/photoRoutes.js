const express = require("express")
const router = express.Router()
const {
  getPhotos,
  getPhoto,
  createPhoto,
  updatePhoto,
  deletePhoto,
  likePhoto,
  unlikePhoto,
  checkFavorite,
  getLikes,
} = require("../controllers/photoController")

// Routes for /api/photos
router.route("/").get(getPhotos).post(createPhoto)
router.route("/user/:userId").get(getPhotosByUserId)

// Routes for /api/photos/:id
router.route("/:id").get(getPhoto).put(updatePhoto).delete(deletePhoto)

// Routes for liking/unliking a photo
router.route("/:id/like").post(likePhoto)

router.route("/:id/unlike").post(unlikePhoto)

// Route to check if a user has liked a photo
router.route("/:id/check-like").get(checkFavorite)

// Route to get all users who liked a photo
router.route("/:id/likes").get(getLikes)

module.exports = router

