const express = require("express");

const {
  signup,
  login,
  dashboard,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
console.log("Auth routes loaded");
router.post("/signup", signup);
router.post("/login", login);
router.get("/dashboard", protect, dashboard);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;