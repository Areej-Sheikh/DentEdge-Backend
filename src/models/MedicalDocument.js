const mongoose = require("mongoose");

const medicalDocumentSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
      default: "application/pdf",
    },

    fileSize: Number,

    uploadedAt: {
      type: Date,
      default: Date.now,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
  },
  { _id: true }
);

module.exports = medicalDocumentSchema;