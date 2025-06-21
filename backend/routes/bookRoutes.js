const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const {
  addBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");
const upload = require("../middleware/uploadMiddleware");

// ✅ Upload book with cover image (admin only)
router.post(
  "/add",
  authMiddleware,
  isAdmin,
  upload.single("coverImage"),
  addBook
);

// 📘 Public routes
router.get("/", getBooks); // View books
router.get("/:id", getBookById);

// ✏️ Update & 🗑️ Delete (admin only)
router.put("/:id", authMiddleware, isAdmin, updateBook);
router.delete("/:id", authMiddleware, isAdmin, deleteBook);

module.exports = router;
