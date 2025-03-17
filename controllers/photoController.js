const Photo = require("../models/Photo")
const Favorite = require("../models/Favorite")

// Get all photos
exports.getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({});
    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get photos by user ID
exports.getPhotosByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const photos = await Photo.find({ user: userId });
    
    if (photos.length === 0) {
      return res.status(404).json({ message: 'No photos found for this user' });
    }

    res.status(200).json({
      count: photos.length,
      data: photos
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Server Error', 
      error: error.message 
    });
  }
};

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
    console.log('Incoming photo creation request body:', JSON.stringify(req.body, null, 2));
    const { title, user } = req.body;

    if (!title || !user || !req.body.image?.url) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng cấp quyền truy cập và cung cấp đầy đủ thông tin'
      });
    }

    const photo = await Photo.create({
      title,
      userId: user,
      image: {
        url: [req.body.image.url], // Wrap in array to match schema
        thumbnail: req.body.image.thumbnail || req.body.image.url
      },
      createdAt: new Date()
    });

    res.status(201).json({
      success: true,
      data: photo
    });

  } catch (err) {
    console.error('Photo creation error:', {
      error: err.message,
      stack: err.stack,
      requestBody: req.body,
      validationErrors: err.errors || null,
      fullError: JSON.stringify(err, Object.getOwnPropertyNames(err))
    });
    
    const errorMessage = err.name === 'ValidationError' 
      ? `Dữ liệu không hợp lệ: ${err.message.replace('Path `image.url`', 'URL ảnh').replace('is required', 'là bắt buộc')}`
      : `Lỗi server: ${err.message}`;

    res.status(500).json({
      success: false,
      error: errorMessage
    });
  }
};

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

