const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  phone: {
    type: String
  },

  password: {
    type: String,
    required: true,
    select: false
  },

  role: {
    type: String,
    enum: ["patient", "doctor", "staff"],
    default: "patient"
  },

  doctorId: {
    type: String,
    unique: true,
    sparse: true,   // allows null for patients
    trim: true
  },

  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clinic"
  },

  resetToken: String,

  resetTokenExpiry: Date

},
{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);