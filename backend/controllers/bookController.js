const Book = require("../models/book");

// ➕ Add Book (Admin Only) — With Cover Image Upload Support
exports.addBook = async (req, res) => {
  try {
    const { title, author, genre, description, publishedYear } = req.body;

    const newBook = new Book({
      title,
      author,
      genre,
      description,
      publishedYear,
      coverImage: req.file ? `/uploads/${req.file.filename}` : "", // ⬅️ Save image path if uploaded
    });

    await newBook.save();

    res.status(201).json({
      message: "Book added successfully!",
      book: newBook,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add book", error });
  }
};

// 📘 Get All Books (with optional filters and pagination)
exports.getBooks = async (req, res) => {
  try {
    const { title, author, genre, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (title) filter.title = new RegExp(title, "i");
    if (author) filter.author = new RegExp(author, "i");
    if (genre) filter.genre = new RegExp(genre, "i");

    const books = await Book.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Book.countDocuments(filter);

    res.json({
      books,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch books", error });
  }
};

// 📖 Get Book By ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch book" });
  }
};

// ✏️ Update Book (Admin Only)
exports.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const updates = req.body;

    if (req.file) {
      updates.coverImage = `/uploads/${req.file.filename}`;
    }

    const updatedBook = await Book.findByIdAndUpdate(bookId, updates, {
      new: true,
    });

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book updated successfully", book: updatedBook });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update book", error: err });
  }
};

// 🗑️ Delete Book (Admin Only)
exports.deleteBook = async (req, res) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete book", error: err });
  }
};
