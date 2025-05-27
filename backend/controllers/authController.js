const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../email/sendEmail");
const { validationResult } = require("express-validator");

const registrationOTP = require("../email/registrationOTP");
const welcomeMessage = require("../email/welcomeMessage");
const forgotPassword = require("../email/forgotPassword");
const resetPasswordConfirmation = require("../email/resetPasswordConfirmation");

const CLIENT_URL = process.env.CLIENT_URL;

// Register user and send OTP email
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, password, name } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate 6-digit OTP and expiry 10 min
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    user = new User({
      email,
      password: hashedPassword,
      name,
      otpCode,
      otpExpires,
      isVerified: false,
    });

    await user.save();

    // Send OTP email using template
    const message = registrationOTP(otpCode);
    await sendEmail(user.email, "Verify your email for Bookshelf", message);

    res.status(201).json({
      message:
        "User registered successfully. An OTP has been sent to your email for verification.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Verify OTP endpoint
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    if (
      !user.otpCode ||
      !user.otpExpires ||
      user.otpExpires < Date.now() ||
      user.otpCode !== otp
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user and send welcome email
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified)
      return res
        .status(403)
        .json({ message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // Send welcome email asynchronously
    const welcomeHtml = welcomeMessage(user.name);

    sendEmail(user.email, "Welcome to Bookshelf", welcomeHtml)
      .then(() => console.log("Welcome email sent"))
      .catch((e) => console.error("Welcome email failed:", e));

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Forgot password - send reset OTP
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ message: "User with this email not found" });

    // Generate OTP and expiry for reset password
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const resetOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.resetPasswordOtp = resetOtp;
    user.resetPasswordOtpExpires = resetOtpExpires;

    await user.save();

    // Send OTP email
    const message = forgotPassword(resetOtp);
    await sendEmail(user.email, "Reset Your Password - Bookshelf", message);

    res.json({ message: "Password reset OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset password - verify OTP and update password + send confirmation email
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    if (
      !user.resetPasswordOtp ||
      !user.resetPasswordOtpExpires ||
      user.resetPasswordOtpExpires < Date.now() ||
      user.resetPasswordOtp !== otp
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;

    await user.save();

    // Send confirmation email
    const confirmationHtml = resetPasswordConfirmation(user.name || "");
    await sendEmail(user.email, "Password Reset Successful", confirmationHtml);

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get logged-in user profile
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password -otpCode -otpExpires -resetPasswordOtp -resetPasswordOtpExpires"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
