module.exports = function (otpCode) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Verify Your Email</h2>
      <p>Thanks for registering! Use the following OTP code to verify your email:</p>
      <h3>${otpCode}</h3>
      <p>This code expires in 10 minutes.</p>
      <p>If you did not sign up, please ignore this email.</p>
    </div>
  `;
};
