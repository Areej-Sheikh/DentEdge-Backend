const mongoose = require("mongoose");

const treatmentSchema = require("./TreatmentHistoryEntry");
const medicalDocumentSchema = require("./MedicalDocument");
const treatmentHistoryEntrySchema = require("./TreatmentHistoryEntry"); // ADD

const patientSchema = new mongoose.Schema(
  {
    // Auth
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },

    resetToken: String,
    resetTokenExpiry: Date,

    // Identity
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    dateOfBirth: Date,
    age: Number,

    // Contact
    phone: {
      type: String,
      required: true,
    },

    address: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },

    // Medical
    bloodGroup: String,

    // Uploaded PDFs
    medicalHistoryDocuments: {
      type: [medicalDocumentSchema],
      default: [],
    },

    // Dental History (legacy single-object — kept to avoid breaking other features)
    dentalHistory: {
      lastDentalVisit: Date,
      previousTreatments: [String],
      dentistNotes: String,
    },

    // NEW: Treatment history records for Patient Dashboard
    historyRecords: {
      type: [treatmentHistoryEntrySchema],
      default: [],
      validate: {
        validator: function (val) {
          return val.length <= 5;
        },
        message: "Maximum of 5 treatment history records allowed",
      },
    },

    treatments: [treatmentSchema],

    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },

    patientStatus: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    notes: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Patient", patientSchema);