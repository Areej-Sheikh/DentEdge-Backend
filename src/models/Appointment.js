const mongoose = require("mongoose");
// purpose - appointment details and status
const appointmentSchema = new mongoose.Schema({

    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },

    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },

    clinicId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Clinic",
        required: true
    },

    slotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DoctorSlot",
        required: true
    },

    date: Date,
    time: String,

    status: {
        type: String,
        enum: ["booked", "completed", "cancelled", "no-show"],
        default: "booked"
    }

}, { timestamps: true });


module.exports = mongoose.model("Appointment", appointmentSchema);