const mongoose = require("mongoose");
// purpose - doctor time slots for appointments
const doctorSlotSchema = new mongoose.Schema({

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

    date: {
        type: Date,
        required: true
    },

    time: {
        type: String,
        required: true
    },

    isBooked: {
        type: Boolean,
        default: false
    },

    bookedByAppointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment"
    }

}, { timestamps: true });


module.exports = mongoose.model("DoctorSlot", doctorSlotSchema);