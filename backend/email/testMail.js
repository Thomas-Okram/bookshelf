require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendTest() {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test Email from Bookshelf",
      text: "Hello! This is a test email.",
    });
    console.log("Test email sent:", info.messageId);
  } catch (err) {
    console.error("Error sending test email:", err);
  }
}

sendTest();
