const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    account: {
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      activeCode: {
        type: String,
        default: "",
      },
      isActive: {
        type: Boolean,
        default: false,
      },
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      zipCode: {
        type: Number,
      },
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("User", userSchema)

