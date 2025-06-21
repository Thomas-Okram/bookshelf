import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({ title: "", author: "", genre: "" });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBooks = async () => {
    const query = new URLSearchParams({
      ...filters,
      page,
      limit: 5,
    }).toString();

    try {
      const res = await fetch(`http://localhost:5000/api/books?${query}`);
      const data = await res.json();
      setBooks(data.books);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error fetching books", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [filters, page]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📚 All Books</h2>

      <div style={styles.filters}>
        <input
          type="text"
          name="title"
          value={filters.title}
          placeholder="Search by Title"
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="text"
          name="author"
          value={filters.author}
          placeholder="Search by Author"
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="text"
          name="genre"
          value={filters.genre}
          placeholder="Search by Genre"
          onChange={handleChange}
          style={styles.input}
        />
      </div>

      {books.length === 0 ? (
        <p style={styles.noResult}>No books found.</p>
      ) : (
        books.map((book) => (
          <div key={book._id} style={styles.card}>
            {book.coverImage && (
              <img
                src={`http://localhost:5000${book.coverImage}`}
                alt={book.title}
                style={styles.coverImage}
              />
            )}
            <div>
              <h3>
                <Link to={`/books/${book._id}`} style={styles.link}>
                  {book.title}
                </Link>
              </h3>
              <p>
                <strong>Author:</strong> {book.author || "Unknown"}
              </p>
              <p>
                <strong>Genre:</strong> {book.genre || "N/A"}
              </p>
              <p style={{ color: "#555" }}>
                {book.description?.slice(0, 100)}...
              </p>
            </div>
          </div>
        ))
      )}

      <div style={styles.pagination}>
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          style={styles.button}
        >
          ⬅ Previous
        </button>
        <span style={styles.pageInfo}>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          style={styles.button}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  title: {
    textAlign: "center",
    marginBottom: "2rem",
    color: "#333",
  },
  filters: {
    marginBottom: "2rem",
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    flex: "1 1 30%",
    minWidth: "150px",
  },
  card: {
    display: "flex",
    alignItems: "flex-start",
    gap: "15px",
    padding: "15px",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    marginBottom: "15px",
    backgroundColor: "#fafafa",
  },
  coverImage: {
    width: "100px",
    height: "140px",
    objectFit: "cover",
    borderRadius: "4px",
  },
  link: {
    textDecoration: "none",
    color: "#007bff",
  },
  pagination: {
    marginTop: "2rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
  },
  button: {
    padding: "8px 16px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  pageInfo: {
    fontWeight: "bold",
    color: "#333",
  },
  noResult: {
    textAlign: "center",
    color: "#888",
    marginTop: "2rem",
  },
};

export default BookList;
