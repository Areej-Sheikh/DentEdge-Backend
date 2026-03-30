const express = require("express");

const router = express.Router();

const {
    createDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor
} = require("../controllers/doctorController");


router.post("/", createDoctor);

router.get("/", getDoctors);

router.get("/:id", getDoctorById);

router.put("/:id", updateDoctor);


module.exports = router;