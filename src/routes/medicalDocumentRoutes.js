const express = require("express");
const router = express.Router();

const { upload } = require("../middleware/uploadMedicalHistory"); // destructure

const medicalDocumentController = require("../controllers/medicalDocumentController");
const { protect } = require("../middleware/authMiddleware");

router.post(
  "/upload",
  protect,
  upload.single("file"),
  medicalDocumentController.uploadMedicalHistoryDocument
);

router.get(
  "/",
  protect,
  medicalDocumentController.getMedicalHistoryDocuments
);

router.delete(
  "/:documentId",
  protect,
  medicalDocumentController.deleteMedicalHistoryDocument
);

module.exports = router;