const DoctorAvailability = require("../models/doctorAvailability");

// CREATE OR UPDATE AVAILABILITY
exports.upsertAvailability = async (req, res) => {

    try {

        const { doctorId, clinicId } = req.body;

        const availability = await DoctorAvailability.findOneAndUpdate(
            { doctorId, clinicId },
            req.body,
            {
                returnDocument: "after",
                upsert: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            availability
        });
        console.log("Availability saved successfully");
    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to save availability",
            error: error.message
        });

    }

};



// GET AVAILABILITY FOR DOCTOR
exports.getDoctorAvailability = async (req, res) => {

    try {

        const { doctorId, clinicId } = req.query;

        const availability = await DoctorAvailability.findOne({
            doctorId,
            clinicId
        });

        if (!availability) {
            return res.status(404).json({
                success: false,
                message: "Availability not found"
            });
        }

        res.json({
            success: true,
            availability
        });
        console.log("Fetched availability for doctor");
    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch availability"
        });

    }

};



// DELETE AVAILABILITY
exports.deleteAvailability = async (req, res) => {

    try {

        await DoctorAvailability.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Availability deleted"
        });
        console.log("Availability deleted successfully");
    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to delete availability"
        });

    }

};