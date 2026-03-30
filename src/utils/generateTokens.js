const jwt = require("jsonwebtoken");

// Works with any object that has _id, role, clinicId —
// Patient model now has all three so nothing changes here.

const generateAccessToken = (patient) => {
  return jwt.sign(
    {
      id:       patient._id,
      role:     patient.role,
      clinicId: patient.clinicId
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

const generateRefreshToken = (patient) => {
  return jwt.sign(
    { id: patient._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = {
  generateAccessToken,
  generateRefreshToken
};