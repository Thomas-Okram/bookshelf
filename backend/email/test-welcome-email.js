require("dotenv").config();
const sendEmail = require("./email/sendEmail");
const welcomeMessage = require("./email/welcomeMessage");

async function test() {
  try {
    const html = welcomeMessage("Test User");
    await sendEmail("your.email@example.com", "Welcome to Bookshelf", html);
    console.log("Welcome email sent");
  } catch (err) {
    console.error("Error sending welcome email", err);
  }
}

test();
