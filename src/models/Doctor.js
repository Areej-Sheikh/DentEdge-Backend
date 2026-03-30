const mongoose = require("mongoose");
// purpose - dentist profiles
const doctorSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  specialization: {
    type: String
  },

  email: {
    type: String
  },

  phone: {
    type: String
  },

  clinicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clinic"
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Doctor", doctorSchema);