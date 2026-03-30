const express = require("express");

const router = express.Router();

const {
  getSlotsByDate,
  generateSlots,
  updateSlot
} = require("../controllers/slotController");


router.get("/", getSlotsByDate);

router.post("/generate", generateSlots);

router.put("/:id", updateSlot);


module.exports = router;