const Patient = require("../models/Patient");
const { uploadToCloudinary } = require("../middleware/uploadMedicalHistory");

// ─── POST /patients/treatment-history/upload ────────────────────────────────
exports.uploadTreatmentHistoryDocument = async (req, res) => {
  try {
    console.log("\n========== TREATMENT HISTORY PDF UPLOAD ==========");
    console.log("[uploadTreatmentHistoryDocument] Request received");
    console.log("[uploadTreatmentHistoryDocument] User:", req.user);
    console.log("[uploadTreatmentHistoryDocument] File:", req.file);

    if (!req.file) {
      console.log("[uploadTreatmentHistoryDocument] ERROR: No file received");
      console.log("CONTENT TYPE:", req.headers["content-type"]);

      return res.status(400).json({
        success: false,
        message: "PDF file is required",
      });
    }

    console.log(
      "[uploadTreatmentHistoryDocument] Uploading file to Cloudinary...",
    );
    console.log("[uploadTreatmentHistoryDocument] File Details:", {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    const { name, url } = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname,
    );

    console.log("[uploadTreatmentHistoryDocument] Upload Success");
    console.log("[uploadTreatmentHistoryDocument] Cloudinary Response:", {
      name,
      url,
    });

    return res.status(200).json({ name, url });
  } catch (error) {
    console.error("[uploadTreatmentHistoryDocument] ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Upload failed",
    });
  }
};

// ─── POST /medical-documents/upload ─────────────────────────────────────────
exports.uploadMedicalHistoryDocument = async (req, res) => {
  try {
    console.log("\n========== MEDICAL HISTORY PDF UPLOAD ==========");
    console.log("[uploadMedicalHistoryDocument] Request received");
    console.log("[uploadMedicalHistoryDocument] User ID:", req.user?.id);
    console.log("[uploadMedicalHistoryDocument] File:", req.file);

    const patientId = req.user.id;

    if (!req.file) {
      console.log("[uploadMedicalHistoryDocument] ERROR: No file uploaded");

      return res.status(400).json({
        success: false,
        message: "PDF file is required",
      });
    }

    console.log("[uploadMedicalHistoryDocument] Searching patient:", patientId);

    const patient = await Patient.findById(patientId);

    if (!patient) {
      console.log("[uploadMedicalHistoryDocument] ERROR: Patient not found");

      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    console.log("[uploadMedicalHistoryDocument] Patient found:", patient._id);

    console.log("[uploadMedicalHistoryDocument] Uploading to Cloudinary...");

    const { name, url } = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname,
    );

    console.log("[uploadMedicalHistoryDocument] Cloudinary Upload Success");
    console.log({ name, url });

    patient.medicalHistoryDocuments.push({
      fileName: name,
      fileUrl: url,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: patientId,
    });

    console.log(
      "[uploadMedicalHistoryDocument] Documents Count After Push:",
      patient.medicalHistoryDocuments.length,
    );

    await patient.save();

    console.log(
      "[uploadMedicalHistoryDocument] Patient document updated successfully",
    );

    return res.status(200).json({
      success: true,
      message: "Medical history uploaded successfully",
      data: patient.medicalHistoryDocuments.at(-1),
    });
  } catch (error) {
    console.error("[uploadMedicalHistoryDocument] ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─── GET /medical-documents ─────────────────────────────────────────────────
exports.getMedicalHistoryDocuments = async (req, res) => {
  try {
    console.log("\n========== GET MEDICAL HISTORY DOCUMENTS ==========");
    console.log("[getMedicalHistoryDocuments] User ID:", req.user?.id);

    const patient = await Patient.findById(req.user.id).select(
      "medicalHistoryDocuments",
    );

    if (!patient) {
      console.log("[getMedicalHistoryDocuments] ERROR: Patient not found");

      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    console.log(
      "[getMedicalHistoryDocuments] Documents Found:",
      patient.medicalHistoryDocuments?.length || 0,
    );

    console.log(
      "[getMedicalHistoryDocuments] Documents:",
      patient.medicalHistoryDocuments,
    );

    return res.status(200).json({
      success: true,
      data: patient.medicalHistoryDocuments || [],
    });
  } catch (error) {
    console.error("[getMedicalHistoryDocuments] ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ─── DELETE /medical-documents/:documentId ──────────────────────────────────
exports.deleteMedicalHistoryDocument = async (req, res) => {
  try {
    console.log("\n========== DELETE MEDICAL HISTORY DOCUMENT ==========");
    console.log("[deleteMedicalHistoryDocument] User ID:", req.user?.id);
    console.log(
      "[deleteMedicalHistoryDocument] Document ID:",
      req.params.documentId,
    );

    const { documentId } = req.params;

    const patient = await Patient.findById(req.user.id);

    if (!patient) {
      console.log("[deleteMedicalHistoryDocument] ERROR: Patient not found");

      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    console.log(
      "[deleteMedicalHistoryDocument] Current Document Count:",
      patient.medicalHistoryDocuments.length,
    );

    const document = patient.medicalHistoryDocuments.id(documentId);

    if (!document) {
      console.log("[deleteMedicalHistoryDocument] ERROR: Document not found");

      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    console.log("[deleteMedicalHistoryDocument] Document Found:", {
      id: document._id,
      fileName: document.fileName,
      fileUrl: document.fileUrl,
    });

    document.deleteOne();

    console.log("[deleteMedicalHistoryDocument] Saving updated patient...");

    await patient.save();

    console.log("[deleteMedicalHistoryDocument] Delete Success");
    console.log(
      "[deleteMedicalHistoryDocument] Remaining Documents:",
      patient.medicalHistoryDocuments.length,
    );

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("[deleteMedicalHistoryDocument] ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
