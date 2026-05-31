const Patient = require("../models/Patient");

// ─── GET /patients/treatment-history ────────────────────────────────────────
// Always returns 200. Returns [] when no records exist.
exports.getTreatmentHistory = async (req, res) => {
  try {
    console.log("\n========== GET TREATMENT HISTORY ==========");
    console.log("[getTreatmentHistory] Request received");
    console.log("[getTreatmentHistory] req.user =", req.user);

    if (!req.user || !req.user.id) {
      console.log("[getTreatmentHistory] ERROR: req.user missing");

      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    console.log(
      "[getTreatmentHistory] Fetching history for patient:",
      req.user.id
    );

    const patient = await Patient.findById(req.user.id).select(
      "historyRecords"
    );

    console.log(
      "[getTreatmentHistory] Patient Found:",
      patient ? patient._id : null
    );

    if (!patient) {
      console.log(
        "[getTreatmentHistory] Patient not found. Returning []"
      );

      return res.status(200).json([]);
    }

    console.log(
      "[getTreatmentHistory] History Count:",
      patient.historyRecords?.length || 0
    );

    console.log(
      "[getTreatmentHistory] History Records:",
      JSON.stringify(patient.historyRecords, null, 2)
    );

    console.log("[getTreatmentHistory] SUCCESS");
console.log(
  "RETURNING HISTORY:",
  JSON.stringify(patient.historyRecords, null, 2)
);
    return res.status(200).json(patient.historyRecords || []);
  } catch (error) {
    console.error(
      "[getTreatmentHistory] ERROR MESSAGE:",
      error.message
    );
    console.error(
      "[getTreatmentHistory] ERROR STACK:",
      error.stack
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─── POST /patients/treatment-history ───────────────────────────────────────
// Frontend sends the ENTIRE historyRecords array on every save (add/edit/delete).
// We replace the stored array atomically.
exports.saveTreatmentHistory = async (req, res) => {
  try {
    console.log("\n========== SAVE TREATMENT HISTORY ==========");
    console.log("[saveTreatmentHistory] Request received");
    console.log("[saveTreatmentHistory] req.user =", req.user);
    console.log(
      "[saveTreatmentHistory] Request Body:",
      JSON.stringify(req.body, null, 2)
    );
 console.log("CONTENT TYPE:", req.headers["content-type"]);
    if (!req.user || !req.user.id) {
      console.log("[saveTreatmentHistory] ERROR: req.user missing");

      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { historyRecords } = req.body;

    console.log(
      "[saveTreatmentHistory] historyRecords type:",
      typeof historyRecords
    );

    console.log(
      "[saveTreatmentHistory] historyRecords length:",
      Array.isArray(historyRecords)
        ? historyRecords.length
        : "NOT ARRAY"
    );

    // 1. Payload must be an array
    if (!Array.isArray(historyRecords)) {
      console.log(
        "[saveTreatmentHistory] VALIDATION FAILED: historyRecords is not an array"
      );

      return res.status(400).json({
        success: false,
        message: "historyRecords must be an array",
      });
    }

    // 2. Max 5 records
    if (historyRecords.length > 5) {
      console.log(
        "[saveTreatmentHistory] VALIDATION FAILED: More than 5 records"
      );

      return res.status(400).json({
        success: false,
        message: "Maximum of 5 treatment history records allowed",
      });
    }

    // 3. Validate required fields on every entry
    for (let i = 0; i < historyRecords.length; i++) {
      const entry = historyRecords[i];

      console.log(
        `[saveTreatmentHistory] Validating Record ${i + 1}`
      );

      console.log(
        `[saveTreatmentHistory] Record ${i + 1}:`,
        JSON.stringify(entry, null, 2)
      );

      if (
        !entry.lastDentalVisit ||
        String(entry.lastDentalVisit).trim() === ""
      ) {
        console.log(
          `[saveTreatmentHistory] VALIDATION FAILED: Record ${
            i + 1
          } missing lastDentalVisit`
        );

        return res.status(400).json({
          success: false,
          message: `Record ${i + 1}: lastDentalVisit is required`,
        });
      }

      if (
        !entry.previousTreatment ||
        String(entry.previousTreatment).trim() === ""
      ) {
        console.log(
          `[saveTreatmentHistory] VALIDATION FAILED: Record ${
            i + 1
          } missing previousTreatment`
        );

        return res.status(400).json({
          success: false,
          message: `Record ${i + 1}: previousTreatment is required`,
        });
      }

      if (
        !entry.dentalNotes ||
        String(entry.dentalNotes).trim() === ""
      ) {
        console.log(
          `[saveTreatmentHistory] VALIDATION FAILED: Record ${
            i + 1
          } missing dentalNotes`
        );

        return res.status(400).json({
          success: false,
          message: `Record ${i + 1}: dentalNotes is required`,
        });
      }

      console.log(
        `[saveTreatmentHistory] Record ${i + 1} validation passed`
      );
    }

    console.log(
      "[saveTreatmentHistory] All validations passed"
    );

    console.log(
      "[saveTreatmentHistory] Updating patient:",
      req.user.id
    );

    console.time("[saveTreatmentHistory] Mongo Update");

    const patient = await Patient.findByIdAndUpdate(
      req.user.id,
      { $set: { historyRecords } },
      { new: true, runValidators: true }
    ).select("historyRecords");

    console.timeEnd("[saveTreatmentHistory] Mongo Update");

    if (!patient) {
      console.log(
        "[saveTreatmentHistory] ERROR: Patient not found"
      );

      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    console.log(
      "[saveTreatmentHistory] Save successful"
    );

    console.log(
      "[saveTreatmentHistory] Stored History Count:",
      patient.historyRecords.length
    );

    console.log(
      "[saveTreatmentHistory] Stored Records:",
      JSON.stringify(patient.historyRecords, null, 2)
    );

    console.log(
      "==================== SUCCESS ===================="
    );

    // Return only the updated array — matches frontend contract exactly
    return res.status(200).json(patient.historyRecords);
  } catch (error) {
    console.error(
      "[saveTreatmentHistory] ERROR MESSAGE:",
      error.message
    );
    console.error(
      "[saveTreatmentHistory] ERROR STACK:",
      error.stack
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─── Keep existing addTreatment for doctor/admin use ────────────────────────
exports.addTreatment = async (req, res) => {
  try {
    console.log("\n========== ADD TREATMENT ==========");
    console.log("[addTreatment] Patient ID:", req.params.id);
    console.log("[addTreatment] Request Body:", req.body);

    const {
      treatmentName,
      treatmentDate,
      dentistName,
      notes,
    } = req.body;

    const patient = await Patient.findById(req.params.id);

    console.log(
      "[addTreatment] Patient Found:",
      patient ? patient._id : null
    );

    if (!patient) {
      console.log("[addTreatment] Patient not found");

      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    patient.treatments.push({
      treatmentName,
      treatmentDate,
      dentistName,
      notes,
    });

    console.log(
      "[addTreatment] Treatments Count After Push:",
      patient.treatments.length
    );

    await patient.save();

    console.log("[addTreatment] SUCCESS");

    return res.json({
      success: true,
      message: "Treatment added successfully",
      data: patient,
    });
  } catch (error) {
    console.error(
      "[addTreatment] ERROR MESSAGE:",
      error.message
    );
    console.error(
      "[addTreatment] ERROR STACK:",
      error.stack
    );

    return res.status(500).json({
      success: false,
      message: "Failed to add treatment",
    });
  }
};