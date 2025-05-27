module.exports = function (userName) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Welcome to Bookshelf, ${userName}!</h2>
      <p>Your registration was successful. We're excited to have you with us.</p>
      <p>Start adding books and sharing reviews!</p>
    </div>
  `;
};
