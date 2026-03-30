const Clinic = require("../models/Clinic");


// CREATE CLINIC
exports.createClinic = async (req, res) => {

    try {

        const clinic = new Clinic(req.body);

        await clinic.save();

        res.status(201).json({
            success: true,
            clinic
        });
        console.log("Clinic created successfully", clinic._id);
    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to create clinic",
            error: error.message
        });

    }

};



// GET ALL CLINICS
exports.getClinics = async (req, res) => {

    try {

        const clinics = await Clinic.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            clinics
        });
        console.log("Fetched clinics successfully");
    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch clinics"
        });

    }

};



// GET CLINIC BY ID
exports.getClinicById = async (req, res) => {

    try {

        const clinic = await Clinic.findById(req.params.id);

        if (!clinic) {
            return res.status(404).json({
                success: false,
                message: "Clinic not found"
            });
        }

        res.json({
            success: true,
            clinic
        });
        console.log("Fetched clinic by ID successfully", clinic._id);
    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Error fetching clinic"
        });

    }

};



// UPDATE CLINIC
exports.updateClinic = async (req, res) => {

    try {

        const clinic = await Clinic.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!clinic) {
            return res.status(404).json({
                success: false,
                message: "Clinic not found"
            });
        }

        res.json({
            success: true,
            clinic
        });
        console.log("Clinic updated successfully", clinic._id);
    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to update clinic"
        });

    }

};



// DELETE CLINIC
exports.deleteClinic = async (req, res) => {

    try {

        const clinic = await Clinic.findByIdAndDelete(req.params.id);

        if (!clinic) {
            return res.status(404).json({
                success: false,
                message: "Clinic not found"
            });
        }

        res.json({
            success: true,
            message: "Clinic deleted successfully"
        });
        console.log("Clinic deleted successfully", clinic._id);
    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to delete clinic"
        });

    }

};