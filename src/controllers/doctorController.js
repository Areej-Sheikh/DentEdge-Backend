const Doctor = require("../models/Doctor");


// CREATE DOCTOR
exports.createDoctor = async (req, res) => {

    try {

        const doctor = new Doctor(req.body);

        await doctor.save();

        res.status(201).json({
            success: true,
            doctor
        });
        console.log("Doctor created successfully:", doctor._id);
    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to create doctor"
        });

    }

};



// GET ALL DOCTORS
exports.getDoctors = async (req, res) => {

    try {

        const doctors = await Doctor.find().populate("clinicId");

        res.json({
            success: true,
            doctors
        });
        console.log("Fetched All Doctors");
    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch doctors"
        });

    }

};



// GET SINGLE DOCTOR
exports.getDoctorById = async (req, res) => {

    try {

        const doctor = await Doctor.findById(req.params.id);

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        res.json({
            success: true,
            doctor
        });
        console.log("Fetched Doctor By Id", doctor._id);
    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error fetching doctor"
        });

    }

};



// UPDATE DOCTOR
exports.updateDoctor = async (req, res) => {

    try {

        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({
            success: true,
            doctor
        });
        console.log("Updated Doctor", doctor._id);

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to update doctor"
        });

    }

};