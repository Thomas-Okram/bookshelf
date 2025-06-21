import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); // ✅ Assuming role is stored in localStorage

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/books/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error("Failed to fetch book details", err);
      }
    };

    fetchBook();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await axios.delete(`http://localhost:5000/api/books/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        navigate("/books");
      } catch (err) {
        console.error("Failed to delete book", err);
        alert("❌ Error deleting book");
      }
    }
  };

  if (!book) return <p style={styles.loading}>Loading book details...</p>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {book.coverImage && (
          <img
            src={`http://localhost:5000${book.coverImage}`}
            alt={book.title}
            style={styles.coverImage}
          />
        )}

        <div style={styles.details}>
          <h2 style={styles.title}>{book.title}</h2>
          <p>
            <strong>Author:</strong> {book.author || "Unknown"}
          </p>
          <p>
            <strong>Genre:</strong> {book.genre || "N/A"}
          </p>
          <p>
            <strong>Published:</strong> {book.publishedYear || "N/A"}
          </p>
          <p style={styles.description}>{book.description}</p>

          <div style={styles.actions}>
            {role === "admin" ? (
              <>
                <button
                  onClick={() => navigate(`/books/${id}/edit`)}
                  style={styles.editBtn}
                >
                  ✏️ Edit
                </button>
                <button onClick={handleDelete} style={styles.deleteBtn}>
                  🗑️ Delete
                </button>
              </>
            ) : (
              <button
                onClick={() => alert("📖 Opening reader...")}
                style={styles.readBtn}
              >
                📖 Read Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
  },
  loading: {
    textAlign: "center",
    marginTop: "50px",
    color: "#555",
  },
  card: {
    display: "flex",
    flexDirection: "row",
    gap: "20px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },
  coverImage: {
    width: "160px",
    height: "220px",
    objectFit: "cover",
    borderRadius: "6px",
  },
  details: {
    flex: 1,
  },
  title: {
    marginBottom: "10px",
    fontSize: "24px",
    color: "#2c3e50",
  },
  description: {
    marginTop: "10px",
    color: "#555",
    lineHeight: "1.5",
  },
  actions: {
    marginTop: "20px",
    display: "flex",
    gap: "10px",
  },
  editBtn: {
    padding: "10px 16px",
    backgroundColor: "#3498db",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "10px 16px",
    backgroundColor: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  readBtn: {
    padding: "10px 20px",
    backgroundColor: "#2ecc71",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default BookDetail;
