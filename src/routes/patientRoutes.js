const express = require("express");
const router = express.Router();

const patientController = require("../controllers/patientController");
const { protect } = require("../middleware/authMiddleware");

// ─── Logged-in patient (must come before /:id) ────────────────────────────────
router.get("/me",                 protect, patientController.getMyProfile);
router.get("/treatment-history",  protect, patientController.getTreatmentHistory);
router.post("/treatment-history", protect, patientController.saveTreatmentHistory);

// ─── Admin / doctor ───────────────────────────────────────────────────────────
router.post("/:id/treatment", protect, patientController.addTreatment);
router.get("/",                protect, patientController.getPatients);
router.get("/:id",             protect, patientController.getPatientById);
router.put("/:id",             protect, patientController.updatePatient);
router.delete("/:id",          protect, patientController.deletePatient);

module.exports = router; 