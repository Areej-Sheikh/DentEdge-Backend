const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema({
  // Changed ref from "User" to "Patient"
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true
  },

  token: {
    type: String,
    required: true
  },

  expiresAt: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);