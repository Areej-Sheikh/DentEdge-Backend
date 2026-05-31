const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary from env variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Keep file in memory — Cloudinary receives the buffer directly
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"), false);
    }
    cb(null, true);
  },
});

/**
 * Uploads a buffer to Cloudinary and resolves with { name, url }.
 * Used by the treatment-history upload controller.
 */
const uploadToCloudinary = (buffer, originalName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",   // PDFs must be "raw", not "image"
        folder: "treatment-history",
        format: "pdf",
        use_filename: false,
        unique_filename: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          name: originalName,
          url: result.secure_url,
        });
      }
    );
    stream.end(buffer);
  });
};

module.exports = { upload, uploadToCloudinary };