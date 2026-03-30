const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// Swapped: Patient replaces User entirely
const Patient = require("../models/Patient");
const RefreshToken = require("../models/RefreshToken");

const { sendEmail, resetPasswordTemplate } = require("../utils/sendEmail");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens");


// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role, doctorId } = req.body;

    const existing = await Patient.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Account already exists with this email" });
    }

    if (role === "doctor" && !doctorId) {
      return res.status(400).json({ message: "Doctor ID is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = await Patient.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role: role || "patient"
    });

    const accessToken  = generateAccessToken(patient);
    const refreshToken = generateRefreshToken(patient);

    await RefreshToken.create({
      userId:    patient._id,
      token:     refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.status(201).json({
      accessToken,
      refreshToken,
      patient: {
        id:        patient._id,
        firstName: patient.firstName,
        lastName:  patient.lastName,
        email:     patient.email,
        role:      patient.role
      }
    });

  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password, role, doctorId } = req.body;

    // select: false on password field means we must explicitly request it
    const patient = await Patient.findOne({ email }).select("+password");

    if (!patient) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (role === "doctor") {
      if (!doctorId) {
        return res.status(400).json({ message: "Doctor ID is required" });
      }
      if (patient.role !== "doctor" || patient.doctorId !== doctorId) {
        return res.status(401).json({ message: "Invalid Doctor ID" });
      }
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken  = generateAccessToken(patient);
    const refreshToken = generateRefreshToken(patient);

    await RefreshToken.create({
      userId:    patient._id,
      token:     refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      patient: {
        id:        patient._id,
        firstName: patient.firstName,
        lastName:  patient.lastName,
        email:     patient.email,
        role:      patient.role,
        phone:     patient.phone
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// DASHBOARD
exports.dashboard = async (req, res) => {
  try {
    // req.user.id comes from the JWT decoded in authMiddleware — now points to a Patient._id
    const patient = await Patient.findById(req.user.id).select("-password");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Dashboard data fetched",
      patient
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const patient = await Patient.findOne({ email });
    if (!patient) {
      // Return 200 even when not found — prevents email enumeration
      return res.status(200).json({ message: "If that email exists, a reset link has been sent" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    patient.resetToken       = token;
    patient.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await patient.save();

    const resetUrl = `http://localhost:3000/reset-password/${token}`;
    await sendEmail({
      to:      patient.email,
      subject: "Password Reset",
      html:    resetPasswordTemplate(resetUrl)
    });

    res.json({ message: "If that email exists, a reset link has been sent" });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const patient = await Patient.findOne({
      resetToken:       token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!patient) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    patient.password         = await bcrypt.hash(password, 10);
    patient.resetToken       = undefined;
    patient.resetTokenExpiry = undefined;
    await patient.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};