const mongoose = require("mongoose")

const favoriteSchema = new mongoose.Schema(
  {
    photoId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Photo",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Favorite", favoriteSchema)

