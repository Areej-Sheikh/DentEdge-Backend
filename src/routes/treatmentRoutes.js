const express = require("express");
const router = express.Router();

const treatmentController = require("../controllers/treatmentController");
const { protect } = require("../middleware/authMiddleware");

// Patient treatment history
router.get(
  "/history",
  protect,
  treatmentController.getTreatmentHistory
);

router.post(
  "/history",
  protect,
  treatmentController.saveTreatmentHistory
);

// Doctor/Admin add treatment
router.post(
  "/:id",
  protect,
  treatmentController.addTreatment
);

module.exports = router;