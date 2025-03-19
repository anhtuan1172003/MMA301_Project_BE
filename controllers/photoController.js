const Photo = require("../models/Photo")
const Favorite = require("../models/Favorite")

// Get all photos 
exports.getPhotos = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1;
    const limit = Number.parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.albumId) {
      query.albumId = req.query.albumId;
    }
    if (req.query.tag) {
      query.tags = req.query.tag;
    }
    if (req.query.userId) { 
      query.userId = req.query.userId;
    }

    const photos = await Photo.find(query)
      .skip(skip)
      .limit(limit)
      .populate("userId")
      .populate("albumId")
      .lean(); // Sử dụng lean() để trả về plain JavaScript objects thay vì Mongoose Documents

    const total = await Photo.countDocuments(query);

    res.status(200).json({
      success: true,
      count: photos.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
      data: photos,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
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
    const { title, userId } = req.body;

    if (!title || !userId || !req.body.image?.url) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng cấp quyền truy cập và cung cấp đầy đủ thông tin'
      });
    }

    // Process the image URLs properly
    let imageUrls = [];
    
    if (Array.isArray(req.body.image.url)) {
      // If client sends an array, use it directly
      imageUrls = req.body.image.url;
    } else if (typeof req.body.image.url === 'string') {
      // If client sends a string, try to parse it
      try {
        // Check if it's a JSON string representation of an array
        const parsedUrls = JSON.parse(req.body.image.url);
        if (Array.isArray(parsedUrls)) {
          imageUrls = parsedUrls;
        } else {
          // If it's not an array after parsing, use as single item
          imageUrls = [req.body.image.url];
        }
      } catch (e) {
        // If it's not valid JSON, check if it's comma-separated
        if (req.body.image.url.includes(',')) {
          imageUrls = req.body.image.url.split(',');
        } else {
          // Otherwise, use as a single item
          imageUrls = [req.body.image.url];
        }
      }
    }

    const photo = await Photo.create({
      title,
      userId: userId,
      image: {
        url: imageUrls, // Use the properly processed array
        thumbnail: req.body.image.thumbnail || (imageUrls.length > 0 ? imageUrls[0] : '')
      },
      location: req.body.location || null,
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

