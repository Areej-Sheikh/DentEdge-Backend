const Appointment = require("../models/Appointment");
const DoctorSlot = require("../models/DoctorSlot");


// CREATE APPOINTMENT (with slot lock)
exports.createAppointment = async (req, res) => {

    try {

        const { patientId, doctorId, clinicId, slotId, date, time } = req.body;

        const slot = await DoctorSlot.findOneAndUpdate(
            { _id: slotId, isBooked: false },
            { $set: { isBooked: true } },
            { returnDocument: "after" }
        );

        if (!slot) {
            return res.status(400).json({
                success: false,
                message: "Slot already booked"
            });
        }

        const appointment = new Appointment({
            patientId,
            doctorId,
            clinicId,
            slotId,
            date,
            time
        });

        await appointment.save();

        slot.bookedByAppointment = appointment._id;
        await slot.save();

        res.status(201).json({
            success: true,
            appointment
        });
        console.log("Appointment created successfully", appointment._id);

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to create appointment"
        });

    }

};



// GET ALL APPOINTMENTS
exports.getAppointments = async (req, res) => {

    try {

        const appointments = await Appointment.find()
            .populate("patientId", "name phone")
            .populate("doctorId", "name specialization")
            .populate("clinicId", "name city")
            .populate("slotId", "time date")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            appointments
        });
        console.log("Fetched Appointments");
    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch appointments"
        });

    }

};



// GET APPOINTMENT BY ID
exports.getAppointmentById = async (req, res) => {

    try {

        const appointment = await Appointment.findById(req.params.id)
            .populate("patientId", "name phone")
            .populate("doctorId", "name specialization")
            .populate("clinicId", "name city")
            .populate("slotId", "time date");

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        res.json({
            success: true,
            appointment
        });
        console.log("Fetched Appointments By ID", appointment._id);
    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error fetching appointment"
        });

    }

};



// UPDATE APPOINTMENT STATUS
exports.updateAppointmentStatus = async (req, res) => {

    try {

        const { status } = req.body;

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        res.json({
            success: true,
            appointment
        });
        console.log("Appointment status updated", appointment._id, "new status:", status);
    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to update appointment status"
        });

    }

};



// CANCEL APPOINTMENT (unlock slot)
exports.cancelAppointment = async (req, res) => {

    try {

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        appointment.status = "cancelled";
        await appointment.save();

        await DoctorSlot.findByIdAndUpdate(
            appointment.slotId,
            {
                isBooked: false,
                bookedByAppointment: null
            }
        );

        res.json({
            success: true,
            message: "Appointment cancelled successfully"
        });
        console.log("Appointment cancelled successfully", appointment._id);
    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Cancellation failed"
        });

    }

};