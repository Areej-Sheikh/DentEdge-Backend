const express = require("express");

const router = express.Router();

const {
    createClinic,
    getClinics,
    getClinicById,
    updateClinic,
    deleteClinic
} = require("../controllers/clinicController");

// CREATE
router.post("/", createClinic);

// GET ALL
router.get("/", getClinics);

// GET SINGLE
router.get("/:id", getClinicById);

// UPDATE
router.put("/:id", updateClinic);

// DELETE
router.delete("/:id", deleteClinic);


module.exports = router;