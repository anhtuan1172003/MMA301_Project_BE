const express = require("express")
const router = express.Router()
const { seedDatabase } = require("../controllers/seedController")

// Route for /api/seed
router.route("/").get(seedDatabase)

module.exports = router

