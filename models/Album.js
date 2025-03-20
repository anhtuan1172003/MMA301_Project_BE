const mongoose = require("mongoose")

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    images: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Photo"
    }],
  },
  { timestamps: true },
)

module.exports = mongoose.model("Album", albumSchema)

