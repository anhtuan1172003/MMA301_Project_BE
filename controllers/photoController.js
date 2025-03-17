const Photo = require("../models/photo")
const Favorite = require("../models/favorite")

// Get all photos
exports.getPhotos = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Build query
    const query = {}
    if (req.query.albumId) {
      query.albumId = req.query.albumId
    }
    if (req.query.tag) {
      query.tags = req.query.tag
    }

    const photos = await Photo.find(query).skip(skip).limit(limit).populate("albumId")

    const total = await Photo.countDocuments(query)

    res.status(200).json({
      success: true,
      count: photos.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: photos,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    })
  }
}

// Get single photo
exports.getPhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id).populate("albumId")

    if (!photo) {
      return res.status(404).json({
        success: false,
        error: "Photo not found",
      })
    }

    res.status(200).json({
      success: true,
      data: photo,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    })
  }
}

// Create new photo
exports.createPhoto = async (req, res) => {
  try {
    const photo = await Photo.create(req.body)

    res.status(201).json({
      success: true,
      data: photo,
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

// Update photo
exports.updatePhoto = async (req, res) => {
  try {
    const photo = await Photo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!photo) {
      return res.status(404).json({
        success: false,
        error: "Photo not found",
      })
    }

    res.status(200).json({
      success: true,
      data: photo,
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

// Delete photo
exports.deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findByIdAndDelete(req.params.id)

    if (!photo) {
      return res.status(404).json({
        success: false,
        error: "Photo not found",
      })
    }

    // Also delete all favorites for this photo
    await Favorite.deleteMany({ photoId: req.params.id })

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

// Like a photo
exports.likePhoto = async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      })
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      photoId: req.params.id,
      userId,
    })

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        error: "Photo already liked by this user",
      })
    }

    // Create new favorite
    await Favorite.create({
      photoId: req.params.id,
      userId,
    })

    // Increment likes count
    const photo = await Photo.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true })

    if (!photo) {
      return res.status(404).json({
        success: false,
        error: "Photo not found",
      })
    }

    res.status(200).json({
      success: true,
      data: photo,
      message: "Photo liked successfully",
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      success: false,
      error: "Server Error",
    })
  }
}

// Unlike a photo
exports.unlikePhoto = async (req, res) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      })
    }

    // Check if favorited
    const existingFavorite = await Favorite.findOne({
      photoId: req.params.id,
      userId,
    })

    if (!existingFavorite) {
      return res.status(400).json({
        success: false,
        error: "Photo not liked by this user",
      })
    }

    // Remove the favorite
    await Favorite.findByIdAndDelete(existingFavorite._id)

    // Decrement likes count
    const photo = await Photo.findByIdAndUpdate(req.params.id, { $inc: { likes: -1 } }, { new: true })

    if (!photo) {
      return res.status(404).json({
        success: false,
        error: "Photo not found",
      })
    }

    res.status(200).json({
      success: true,
      data: photo,
      message: "Photo unliked successfully",
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      success: false,
      error: "Server Error",
    })
  }
}

// Check if user has favorited a photo
exports.checkFavorite = async (req, res) => {
  try {
    const { userId } = req.query

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      })
    }

    const favorite = await Favorite.findOne({
      photoId: req.params.id,
      userId,
    })

    res.status(200).json({
      success: true,
      favorited: !!favorite,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    })
  }
}

// Get all users who liked a photo
exports.getLikes = async (req, res) => {
  try {
    const favorites = await Favorite.find({ photoId: req.params.id }).populate("userId")

    res.status(200).json({
      success: true,
      count: favorites.length,
      data: favorites,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Server Error",
    })
  }
}

