// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");

router.get(
  "/dashboard",
  authMiddleware,
  isAdmin,
  adminController.getDashboardStats
);

module.exports = router;
