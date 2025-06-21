const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure 'uploads' directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  },
});

// ✅ No file filter — allows all file types
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // optional: 5MB file size limit
});

module.exports = upload;
