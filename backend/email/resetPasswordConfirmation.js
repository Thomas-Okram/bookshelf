module.exports = function (userName) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Password Reset Successful</h2>
      <p>Hello ${userName},</p>
      <p>Your password has been successfully reset. If you did not perform this action, please contact support immediately.</p>
      <p>Thank you for using Bookshelf!</p>
    </div>
  `;
};
