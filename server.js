// Load environment variables
require("dotenv").config({ quiet: true });

// Configure DNS settings
const dns = require("dns");
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
dns.setDefaultResultOrder("ipv4first");

// External dependencies
const express = require("express");
const cors = require("cors");

// Local modules
const connectDB = require("./src/config/db");

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Global middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Contact routes
const contactRoutes = require("./src/routes/contactRoutes");
app.use("/api/contact", contactRoutes);

// Patient routes
const patientRoutes = require("./src/routes/patientRoutes");
app.use("/api/patients", patientRoutes);

// Doctor routes
const doctorRoutes = require("./src/routes/doctorRoutes");
app.use("/api/doctors", doctorRoutes);

// Doctor slot routes
const slotRoutes = require("./src/routes/slotRoutes");
app.use("/api/doctor-slots", slotRoutes);

// Appointment routes
const appointmentRoutes = require("./src/routes/appointmentRoutes");
app.use("/api/appointments", appointmentRoutes);

// Clinic routes
const clinicRoutes = require("./src/routes/clinicRoutes");
app.use("/api/clinics", clinicRoutes);

// Availability routes
const availabilityRoutes = require("./src/routes/availabilityRoutes");
app.use("/api/doctor-availability", availabilityRoutes);

// Authentication routes
const authRoutes = require("./src/routes/authRoutes");
app.use("/api", authRoutes);


// Health check endpoint
app.get("/api/health", (req, res) => res.json({ status: "OK" }));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));