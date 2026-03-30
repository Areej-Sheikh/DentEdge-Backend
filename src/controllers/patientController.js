const Patient = require("../models/Patient");

// GET MY PROFILE (logged-in patient)
exports.getMyProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id).select("-password");
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }
    res.json({ success: true, data: patient });
  } catch (error) {
    console.error("Get My Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET TREATMENT HISTORY (logged-in patient)
exports.getTreatmentHistory = async (req, res) => {
  try {
    console.log(
      "[getTreatmentHistory] Request received for user:",
      req.user.id,
    );
    console.log("req.user:", req.user); // what's in the token
    console.log("looking for id:", req.user.id); // is this the right field?
    const patient = await Patient.findById(req.user.id).select("dentalHistory");

    console.log("[getTreatmentHistory] Patient found:", patient ? true : false);

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }

    console.log(
      "[getTreatmentHistory] Dental history exists:",
      patient.dentalHistory ? true : false,
    );

    res.status(200).json({
      success: true,
      data: patient.dentalHistory || {},
    });
  } catch (error) {
    console.error("Get Treatment History Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// SAVE TREATMENT HISTORY (logged-in patient)
exports.saveTreatmentHistory = async (req, res) => {
  try {
    console.log(
      "[saveTreatmentHistory] Request received for user:",
      req.user.id,
    );
    console.log("[saveTreatmentHistory] Payload:", req.body);

    const { lastDentalVisit, previousTreatments, dentistNotes } = req.body;

    const patient = await Patient.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          "dentalHistory.lastDentalVisit": lastDentalVisit || null,
          "dentalHistory.previousTreatments": previousTreatments,
          "dentalHistory.dentistNotes": dentistNotes,
        },
      },
      { new: true, runValidators: true },
    );

    console.log(
      "[saveTreatmentHistory] Patient updated:",
      patient ? patient._id : null,
    );

    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }

    console.log(
      "[saveTreatmentHistory] Updated dentalHistory:",
      patient.dentalHistory,
    );

    res.status(200).json({
      success: true,
      message: "Treatment history saved",
      data: patient.dentalHistory,
    });
  } catch (error) {
    console.error("Treatment History Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ─── Admin / CRM ──────────────────────────────────────────────────────────────

exports.getPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .select("-password")
      .sort({ createdAt: -1 });
    res.json({ success: true, count: patients.length, data: patients });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch patients" });
  }
};

exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).select("-password");
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }
    res.json({ success: true, data: patient });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching patient" });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    console.log("UPDATE PAYLOAD:", req.body);

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

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { $set: allowedUpdates },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    res.json({
      success: true,
      message: "Patient updated successfully",
      data: patient,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }
    res.json({ success: true, message: "Patient deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete patient" });
  }
};

exports.addTreatment = async (req, res) => {
  try {
    const { treatmentName, treatmentDate, dentistName, notes } = req.body;
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    }
    patient.treatments.push({
      treatmentName,
      treatmentDate,
      dentistName,
      notes,
    });
    await patient.save();
    res.json({
      success: true,
      message: "Treatment added successfully",
      data: patient,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to add treatment" });
  }
};
