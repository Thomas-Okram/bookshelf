const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const { authMiddleware } = require("../middleware/authMiddleware"); // ✅ FIXED

// Registration route
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be 6+ chars"),
    body("name")
      .optional()
      .isLength({ max: 50 })
      .withMessage("Name max 50 chars"),
  ],
  authController.register
);

// OTP verification route
router.post(
  "/verify-otp",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits"),
  ],
  authController.verifyOtp
);

// Login route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  authController.login
);

// Get logged-in user profile
router.get("/me", authMiddleware, authController.getMe);

// Forgot Password - request OTP
router.post(
  "/forgot-password",
  [body("email").isEmail().withMessage("Please enter a valid email")],
  authController.forgotPassword
);

// Reset Password - verify OTP and update password
router.post(
  "/reset-password",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
  ],
  authController.resetPassword
);

module.exports = router;
