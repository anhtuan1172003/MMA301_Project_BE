const Album = require("../models/Album")

// Get all albums
exports.getAlbums = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Build query
    const query = {}
    if (req.query.userId) {
      query.userId = req.query.userId
    }

    const albums = await Album.find(query).skip(skip).limit(limit).populate("userId")

    const total = await Album.countDocuments(query)

    res.status(200).json({
      success: true,
      count: albums.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: albums,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    })
  }
}

// Get single album
exports.getAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id).populate("userId")

    if (!album) {
      return res.status(404).json({
        success: false,
        error: "Album not found",
      })
    }

    res.status(200).json({
      success: true,
      data: album,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    })
  }
}

// Create new album
exports.createAlbum = async (req, res) => {
  try {
    const album = await Album.create(req.body)

    res.status(201).json({
      success: true,
      data: album,
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

// Update album
exports.updateAlbum = async (req, res) => {
  try {
    const album = await Album.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!album) {
      return res.status(404).json({
        success: false,
        error: "Album not found",
      })
    }

    res.status(200).json({
      success: true,
      data: album,
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

// Delete album
exports.deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findByIdAndDelete(req.params.id)

    if (!album) {
      return res.status(404).json({
        success: false,
        error: "Album not found",
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

