const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const documentMetaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null,
    },
    url: {
      type: String,
      default: null,
    },
  },
  { _id: false }
);

const treatmentHistoryEntrySchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
    },

    lastDentalVisit: {
      type: String,
      required: [true, "lastDentalVisit is required"],
    },

    previousTreatment: {
      type: String,
      required: [true, "previousTreatment is required"],
    },

    dentalNotes: {
      type: String,
      required: [true, "dentalNotes is required"],
    },

    document: {
      type: documentMetaSchema,
      default: null,
    },

    createdAt: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  { _id: false }
);

module.exports = treatmentHistoryEntrySchema;