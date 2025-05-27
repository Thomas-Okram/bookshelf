const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String, default: "" },
  avatar: { type: String, default: "" },

  // Email verification OTP code and expiry
  otpCode: String,
  otpExpires: Date,
  isVerified: { type: Boolean, default: false },

  // For backward compatibility if you still want to support token-based verification
  verificationToken: String,

  // Password reset OTP code and expiry
  resetPasswordOtp: String,
  resetPasswordOtpExpires: Date,

  // For backward compatibility if you want to support token-based password reset
  resetPasswordToken: String,
  resetPasswordExpires: Date,

  createdAt: { type: Date, default: Date.now },
  role: { type: String, enum: ["user", "admin"], default: "user" },
});

module.exports = mongoose.model("User", userSchema);
