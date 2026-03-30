const mongoose = require("mongoose");

// purpose - clinic information
// Clinic Admin
const clinicAdminSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    role: {
        type: String,
        default: "admin"
    }
});


// Working Hours
const workingHoursSchema = new mongoose.Schema({
    day: String,
    open: String,
    close: String,
    isClosed: {
        type: Boolean,
        default: false
    }
});


// Treatment Rooms
const treatmentRoomSchema = new mongoose.Schema({
    roomNumber: String,
    roomName: String,
    isActive: {
        type: Boolean,
        default: true
    }
});


// Mobile Camp Locations
const campLocationSchema = new mongoose.Schema({
    locationName: String,
    address: String,
    city: String,
    contactPerson: String,
    phone: String
});


// Billing Settings
const billingSettingsSchema = new mongoose.Schema({
    currency: {
        type: String,
        default: "INR"
    },
    taxPercentage: {
        type: Number,
        default: 0
    },
    invoicePrefix: {
        type: String,
        default: "INV"
    },
    invoiceStartNumber: {
        type: Number,
        default: 1000
    }
});


const clinicSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    address: String,
    city: String,
    phone: String,
    email: String,

    clinicAdmin: clinicAdminSchema,

    workingHours: [workingHoursSchema],

    treatmentRooms: [treatmentRoomSchema],

    campLocations: [campLocationSchema],

    billingSettings: billingSettingsSchema

}, { timestamps: true });


module.exports = mongoose.model("Clinic", clinicSchema);