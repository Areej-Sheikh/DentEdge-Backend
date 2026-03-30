const express = require("express");

const router = express.Router();

const {
    upsertAvailability,
    getDoctorAvailability,
    deleteAvailability
} = require("../controllers/availabilityController");


// create or update availability
router.post("/", upsertAvailability);


// get availability
router.get("/", getDoctorAvailability);


// delete availability
router.delete("/:id", deleteAvailability);


module.exports = router;