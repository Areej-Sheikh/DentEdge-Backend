const express = require("express");
const router = express.Router();

const patientController = require("../controllers/patientController");
const treatmentController = require("../controllers/treatmentController");
const { upload } = require("../middleware/uploadMedicalHistory"); // destructure
const medicalDocumentController = require("../controllers/medicalDocumentController");
const { protect } = require("../middleware/authMiddleware");

// Existing patient routes
router.get("/me", protect, patientController.getMyProfile);

// Treatment history — upload must be registered BEFORE /treatment-history
router.post(
  "/treatment-history/upload",
  protect,
  upload.single("file"),
  medicalDocumentController.uploadTreatmentHistoryDocument,
);

router.get(
  "/treatment-history",
  protect,
  treatmentController.getTreatmentHistory,
);

router.post(
  "/treatment-history",
  protect,
  treatmentController.saveTreatmentHistory,
);
router.get("/", protect, patientController.getPatients);
router.put("/:id", protect, patientController.updatePatient);
router.delete("/:id", protect, patientController.deletePatient);

router.get("/:id", protect, patientController.getPatientById);

module.exports = router;
