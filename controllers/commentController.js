const Comment = require("../models/comment")

// Get all comments
exports.getComments = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Build query
    const query = {}
    if (req.query.photoId) {
      query.photoId = req.query.photoId
    }
    if (req.query.userId) {
      query.userId = req.query.userId
    }

    const comments = await Comment.find(query).skip(skip).limit(limit).populate("photoId").populate("userId")

    const total = await Comment.countDocuments(query)

    res.status(200).json({
      success: true,
      count: comments.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: comments,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    })
  }
}

// Get single comment
exports.getComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id).populate("photoId").populate("userId")

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: "Comment not found",
      })
    }

    res.status(200).json({
      success: true,
      data: comment,
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    })
  }
}

// Create new comment
exports.createComment = async (req, res) => {
  try {
    const comment = await Comment.create(req.body)

    res.status(201).json({
      success: true,
      data: comment,
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

// Update comment
exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: "Comment not found",
      })
    }

    res.status(200).json({
      success: true,
      data: comment,
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

// Delete comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findByIdAndDelete(req.params.id)

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: "Comment not found",
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

