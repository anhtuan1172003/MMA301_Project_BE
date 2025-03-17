const Favorite = require("../models/Favorite")

// Get all favorites
exports.getFavorites = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Build query
    const query = {}
    if (req.query.photoId) {
      query.photoId = req.query.photoId // Sử dụng _id trực tiếp
    }
    if (req.query.userId) {
      query.userId = req.query.userId // Sử dụng _id trực tiếp
    }

    const favorites = await Favorite.find(query).skip(skip).limit(limit).populate("photoId").populate("userId")

    const total = await Favorite.countDocuments(query)

    res.status(200).json({
      success: true,
      count: favorites.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: favorites,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    })
  }
}

// Get single favorite
exports.getFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findById(req.params.id).populate("photoId").populate("userId")

    if (!favorite) {
      return res.status(404).json({
        success: false,
        error: "Favorite not found",
      })
    }

    res.status(200).json({
      success: true,
      data: favorite,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    })
  }
}

// Create new favorite
exports.createFavorite = async (req, res) => {
  try {
    // Check if favorite already exists
    const existingFavorite = await Favorite.findOne({
      photoId: req.body.photoId,
      userId: req.body.userId,
    })

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        error: "User has already favorited this photo",
      })
    }

    const favorite = await Favorite.create(req.body)

    res.status(201).json({
      success: true,
      data: favorite,
    })
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message)
      return res.status(400).json({
        success: false,
        error: messages,
      })
    } else {
      return res.status(500).json({
        success: false,
        error: "Server Error",
      })
    }
  }
}

// Delete favorite
exports.deleteFavorite = async (req, res) => {
  try {
    const favorite = await Favorite.findByIdAndDelete(req.params.id)

    if (!favorite) {
      return res.status(404).json({
        success: false,
        error: "Favorite not found",
      })
    }

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    })
  }
}

