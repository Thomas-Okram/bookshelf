module.exports = function (otpCode) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Password Reset Request</h2>
      <p>You requested to reset your password. Use the following OTP code to proceed:</p>
      <h3>${otpCode}</h3>
      <p>This code expires in 10 minutes.</p>
      <p>If you did not request this, please ignore this email.</p>
    </div>
  `;
};
