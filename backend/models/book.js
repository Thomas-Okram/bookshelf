const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  genre: String,
  description: String,
  publishedYear: Number,
  coverImage: {
    type: String, // stores relative path like '/uploads/cover123.jpg'
    default: "", // or set a default image URL if needed
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Book", bookSchema);
