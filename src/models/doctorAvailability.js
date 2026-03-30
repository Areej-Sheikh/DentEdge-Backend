const mongoose = require("mongoose");

// purpose - doctor availability and scheduling rules


// Session schema (morning / afternoon)
const sessionSchema = new mongoose.Schema({
    start: {
        type: String,
        required: true
    },
    end: {
        type: String,
        required: true
    }
}, { _id: false });


// Weekly schedule
const weeklyScheduleSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true,
        enum: [
            "Monday","Tuesday","Wednesday",
            "Thursday","Friday","Saturday","Sunday"
        ]
    },
    sessions: [sessionSchema]
}, { _id: false });


// Break times
const breakTimeSchema = new mongoose.Schema({
    start: String,
    end: String
}, { _id: false });


const doctorAvailabilitySchema = new mongoose.Schema({

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

    weeklySchedule: [weeklyScheduleSchema],

    slotDuration: {
        type: Number,
        default: 60   // minutes
    },

    breakTimes: [breakTimeSchema]

}, { timestamps: true });


// prevent duplicate availability rule per doctor per clinic
doctorAvailabilitySchema.index(
    { doctorId: 1, clinicId: 1 },
    { unique: true }
);

module.exports = mongoose.model("DoctorAvailability", doctorAvailabilitySchema);