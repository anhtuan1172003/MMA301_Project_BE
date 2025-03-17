const User = require("../models/User")
const Album = require("../models/Album")
const Photo = require("../models/Photo")
const Comment = require("../models/Comment")
const Favorite = require("../models/Favorite")

// Sample data from the provided JSON
const sampleData = {
  users: [
    {
      name: "john",
      account: {
        email: "u1@gmail.com",
        password: "abc@123",
        activeCode: "ABCDEFXXX",
        isActive: false,
      },
      address: {
        street: "190 Nguyễn Tuân, Thanh Xuân",
        city: "Hà Nội",
        zipCode: 10000,
      },
    },
    {
      name: "Thực Trần Danh",
      account: {
        email: "u2@gmail.com",
        password: "123",
        activeCode: "",
        isActive: true,
      },
      address: {
        street: "Đại Lai - Gia Bình",
        city: "Bình Thuận",
        zipCode: 10000,
      },
    },
    {
      name: "demo123",
      account: {
        email: "thuctdhe171729@fpt.edu.vn",
        password: "123",
        activeCode: "",
        isActive: true,
      },
      address: {
        street: "Ngo Gia Tu Street, Tien An Ward 123",
        city: "Cao Bằng",
      },
    },
  ],
  albums: [
    {
      title: "Summer",
      userId: 0, // Will be replaced with actual ObjectId
    },
    {
      title: "Spring",
      userId: 1, // Will be replaced with actual ObjectId
    },
    {
      title: "Fall",
      userId: 1, // Will be replaced with actual ObjectId
    },
    {
      title: "Su23",
      userId: 2, // Will be replaced with actual ObjectId
    },
    {
      title: "Fall 24",
      userId: 2, // Will be replaced with actual ObjectId
    },
  ],
  photos: [
    {
      title: "Photo 1",
      image: {
        url: [
          "https://media.istockphoto.com/id/517188688/vi/anh/phong-c%E1%BA%A3nh-n%C3%BAi-non.jpg?s=612x612&w=0&k=20&c=WWWaejSo6EWGZMZSK7QK6LCfwd0rL2KB3ImCX2VkW4A=",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuwtlzBB5bWvcNyVHftGd8rKJmpAvNFW7H6Q&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREeX6PYYwmbLVsxX2xoM3DFaADg-4U5W6dmQ&s",
        ],
        thumbnail:
          "https://media.istockphoto.com/id/517188688/vi/anh/phong-c%E1%BA%A3nh-n%C3%BAi-non.jpg?s=612x612&w=0&k=20&c=WWWaejSo6EWGZMZSK7QK6LCfwd0rL2KB3ImCX2VkW4A=",
      },
      albumId: 0, // Will be replaced with actual ObjectId
      tags: ["summer", "hot", "new"],
      likes: 0,
    },
    {
      title: "Photo 2",
      image: {
        url: ["p2.png", "p2_1.png", "p2_2.png", "p2_3.png"],
        thumbnail: "p21.png",
      },
      albumId: 0, // Will be replaced with actual ObjectId
      tags: ["hot", "new"],
      likes: 0,
    },
    {
      title: "Photo 4",
      image: {
        url: ["p4_1.png", "p4_2.png"],
        thumbnail: "p4.png",
      },
      albumId: 1, // Will be replaced with actual ObjectId
      tags: ["beutiful"],
      likes: 0,
    },
    {
      title: "Photo 5",
      image: {
        url: ["p11.png", "p21.png", "p31.png"],
        thumbnail: "p51.png",
      },
      albumId: 1, // Will be replaced with actual ObjectId
      tags: ["col", "hot"],
      likes: 0,
    },
  ],
  comments: [
    {
      photoId: 1, // Will be replaced with actual ObjectId
      userId: 0, // Will be replaced with actual ObjectId
      text: "Bình thường",
      rate: 2,
    },
    {
      photoId: 2, // Will be replaced with actual ObjectId
      userId: 1, // Will be replaced with actual ObjectId
      text: "Rất đẹp",
      rate: 4,
    },
    {
      photoId: 2, // Will be replaced with actual ObjectId
      userId: 0, // Will be replaced with actual ObjectId
      text: "Bình thường",
      rate: 2,
    },
  ],
  favorites: [
    {
      photoId: 0, // Will be replaced with actual ObjectId
      userId: 2, // Will be replaced with actual ObjectId
    },
  ],
}

// Seed database
exports.seedDatabase = async (req, res) => {
  try {
    // Clear existing data
    await User.deleteMany({})
    await Album.deleteMany({})
    await Photo.deleteMany({})
    await Comment.deleteMany({})
    await Favorite.deleteMany({})

    // Seed users
    const users = await User.insertMany(sampleData.users)

    // Seed albums with ObjectId references
    const albumsData = sampleData.albums.map((album) => ({
      ...album,
      userId: users[album.userId]._id,
    }))
    const albums = await Album.insertMany(albumsData)

    // Seed photos with ObjectId references
    const photosData = sampleData.photos.map((photo) => ({
      ...photo,
      albumId: albums[photo.albumId]._id,
    }))
    const photos = await Photo.insertMany(photosData)

    // Seed comments with ObjectId references
    const commentsData = sampleData.comments.map((comment) => ({
      ...comment,
      userId: users[comment.userId]._id,
      photoId: photos[comment.photoId - 1]._id, // Adjust index based on your data
    }))
    const comments = await Comment.insertMany(commentsData)

    // Seed favorites with ObjectId references
    const favoritesData = sampleData.favorites.map((fav) => ({
      userId: users[fav.userId]._id,
      photoId: photos[fav.photoId]._id,
    }))

    // Update likes count for photos that have favorites
    for (const fav of favoritesData) {
      await Photo.findByIdAndUpdate(fav.photoId, { $inc: { likes: 1 } })
    }

    const favorites = await Favorite.insertMany(favoritesData)

    res.status(200).json({
      success: true,
      message: "Database seeded successfully",
      counts: {
        users: users.length,
        albums: albums.length,
        photos: photos.length,
        comments: comments.length,
        favorites: favorites.length,
      },
    })
  } catch (err) {
    console.error("Error seeding database:", err)
    res.status(500).json({
      success: false,
      error: "Server Error",
    })
  }
}

