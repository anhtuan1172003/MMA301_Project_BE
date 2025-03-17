const mongoose = require("mongoose")

const photoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      url: {
        type: [String],
        required: true,
      },
      thumbnail: {
        type: String,
        required: true,
      },
    },
    albumId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Album",
    },
    tags: {
      type: [String],
      default: [],
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Photo", photoSchema)

