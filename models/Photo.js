const mongoose = require("mongoose")

const photoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
    },
    image: {
      url: {
        type: [String],
        required: false,
      },
      thumbnail: {
        type: String,
        required: false,
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

