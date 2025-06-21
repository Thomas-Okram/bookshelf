// controllers/adminController.js
const User = require("../models/User");
const Book = require("../models/book"); // adjust name if it's Book.js or books.js

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBooks = await Book.countDocuments();

    // Placeholder for borrowed books if you add that later
    const totalBorrowed = 0;

    res.json({
      totalUsers,
      totalBooks,
      totalBorrowed,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};
