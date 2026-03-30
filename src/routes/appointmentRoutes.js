const express = require("express");

const router = express.Router();

const {
    createAppointment,
    getAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    cancelAppointment
} = require("../controllers/appointmentController");


router.post("/", createAppointment);

router.get("/", getAppointments);

router.get("/:id", getAppointmentById);

router.put("/:id", updateAppointmentStatus);

router.put("/:id/cancel", cancelAppointment);


module.exports = router;