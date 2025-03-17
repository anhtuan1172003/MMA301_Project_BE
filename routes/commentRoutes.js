const express = require("express")
const router = express.Router()
const {
  getComments,
  getComment,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/commentController")

// Routes for /api/comments
router.route("/").get(getComments).post(createComment)

// Routes for /api/comments/:id
router.route("/:id").get(getComment).put(updateComment).delete(deleteComment)

module.exports = router

