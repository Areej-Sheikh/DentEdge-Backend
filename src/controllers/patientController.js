const Patient = require("../models/Patient");

// GET MY PROFILE
exports.getMyProfile = async (req, res) => {
  try {
    console.log("\n========== GET MY PROFILE ==========");
    console.log("[getMyProfile] Request received");
    console.log("[getMyProfile] req.user =", req.user);

    if (!req.user || !req.user.id) {
      console.log("[getMyProfile] ERROR: req.user missing");

      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const patient = await Patient.findById(req.user.id).select("-password");

    console.log(
      "[getMyProfile] Patient found:",
      patient ? patient._id : null
    );

    if (!patient) {
      console.log("[getMyProfile] Patient not found");

      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    console.log("[getMyProfile] SUCCESS");

    return res.json({
      success: true,
      data: patient,
    });
  } catch (error) {
    console.error("[getMyProfile] ERROR MESSAGE:", error.message);
    console.error("[getMyProfile] ERROR STACK:", error.stack);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET ALL PATIENTS
exports.getPatients = async (req, res) => {
  try {
    console.log("\n========== GET ALL PATIENTS ==========");
    console.log("[getPatients] Request received");
    console.log("[getPatients] User:", req.user);

    const patients = await Patient.find()
      .select("-password")
      .sort({ createdAt: -1 });

    console.log(
      "[getPatients] Total Patients Found:",
      patients.length
    );

    console.log(
      "[getPatients] Patient IDs:",
      patients.map((p) => p._id)
    );

    console.log("[getPatients] SUCCESS");

    return res.json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    console.error("[getPatients] ERROR MESSAGE:", error.message);
    console.error("[getPatients] ERROR STACK:", error.stack);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch patients",
    });
  }
};

// GET PATIENT BY ID
exports.getPatientById = async (req, res) => {
  try {
    console.log("\n========== GET PATIENT BY ID ==========");
    console.log("[getPatientById] Requested ID:", req.params.id);
    console.log("[getPatientById] User:", req.user);

    const patient = await Patient.findById(req.params.id).select("-password");

    console.log(
      "[getPatientById] Patient Found:",
      patient ? patient._id : null
    );

    if (!patient) {
      console.log("[getPatientById] Patient does not exist");

      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    console.log("[getPatientById] SUCCESS");

    return res.json({
      success: true,
      data: patient,
    });
  } catch (error) {
    console.error("[getPatientById] ERROR MESSAGE:", error.message);
    console.error("[getPatientById] ERROR STACK:", error.stack);

    return res.status(500).json({
      success: false,
      message: "Error fetching patient",
    });
  }
};

// UPDATE PATIENT
exports.updatePatient = async (req, res) => {
  try {
    console.log("\n========== UPDATE PATIENT ==========");
    console.log("[updatePatient] Patient ID:", req.params.id);
    console.log("[updatePatient] User:", req.user);
    console.log("[updatePatient] Incoming Body:", req.body);

    const allowedUpdates = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth || undefined,
      age: req.body.age || undefined,
      email: req.body.email,
      phone: req.body.phone,
      bloodGroup: req.body.bloodGroup,
      notes: req.body.notes,
      address: req.body.address || {},
      emergencyContact: req.body.emergencyContact || {},
    };

    console.log(
      "[updatePatient] Allowed Updates:",
      JSON.stringify(allowedUpdates, null, 2)
    );

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { $set: allowedUpdates },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    console.log(
      "[updatePatient] Updated Patient:",
      patient ? patient._id : null
    );

    if (!patient) {
      console.log("[updatePatient] Patient not found");

      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    console.log(
      "[updatePatient] historyRecords count:",
      patient?.historyRecords?.length || 0
    );

    console.log("[updatePatient] SUCCESS");

    return res.json({
      success: true,
      message: "Patient updated successfully",
      data: patient,
    });
  } catch (error) {
    console.error("[updatePatient] ERROR MESSAGE:", error.message);
    console.error("[updatePatient] ERROR STACK:", error.stack);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE PATIENT
exports.deletePatient = async (req, res) => {
  try {
    console.log("\n========== DELETE PATIENT ==========");
    console.log("[deletePatient] Requested ID:", req.params.id);
    console.log("[deletePatient] User:", req.user);

    const patient = await Patient.findByIdAndDelete(req.params.id);

    console.log(
      "[deletePatient] Deleted Patient:",
      patient ? patient._id : null
    );

    if (!patient) {
      console.log("[deletePatient] Patient not found");

      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    console.log("[deletePatient] SUCCESS");

    return res.json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    console.error("[deletePatient] ERROR MESSAGE:", error.message);
    console.error("[deletePatient] ERROR STACK:", error.stack);

    return res.status(500).json({
      success: false,
      message: "Failed to delete patient",
    });
  }
};