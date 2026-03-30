const mongoose = require("mongoose");

const treatmentSchema = new mongoose.Schema({
  treatmentName: { type: String, required: true },
  treatmentDate: { type: Date, required: true },
  dentistName:   { type: String },
  notes:         { type: String }
}, { _id: false });


const patientSchema = new mongoose.Schema({

  // ─── Auth fields ──────────────────────────────────────────────────────────
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    required: true,
    select: false   // never returned in queries unless explicitly requested
  },

  role: {
    type: String,
    enum: ["patient", "doctor", "admin"],
    default: "patient"
  },

  resetToken:       { type: String },
  resetTokenExpiry: { type: Date },

  // ─── Basic Identity ───────────────────────────────────────────────────────
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  gender:    { type: String, enum: ["Male", "Female", "Other"] },
  dateOfBirth: Date,
  age:         Number,

  // ─── Contact ──────────────────────────────────────────────────────────────
  phone: { type: String, required: true },

  address: {
    street:     String,
    city:       String,
    state:      String,
    postalCode: String,
    country:    String
  },

  // ─── Medical ──────────────────────────────────────────────────────────────
  bloodGroup: String,
 
  // ─── Dental History ───────────────────────────────────────────────────────
  dentalHistory: {
    lastDentalVisit:    Date,
    previousTreatments: [String],
    dentistNotes:       String
  },

  treatments: [treatmentSchema],

  // ─── Emergency Contact ────────────────────────────────────────────────────
  emergencyContact: {
    name:         String,
    relationship: String,
    phone:        String
  },

  patientStatus: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active"
  },

  notes: String

}, { timestamps: true });


module.exports = mongoose.model("Patient", patientSchema);