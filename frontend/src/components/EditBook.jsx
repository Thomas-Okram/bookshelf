import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditBook = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    publishedYear: "",
  });

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get(`http://localhost:5000/api/books/${id}`).then((res) => {
      setBook(res.data);
    });
  }, [id]);

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/books/${id}`, book, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(`/books/${id}`);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      alert("❌ Update failed. Please check your input or try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>✏️ Edit Book</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {["title", "author", "genre", "description", "publishedYear"].map(
          (field) => (
            <div key={field} style={styles.formGroup}>
              <label style={styles.label}>
                {field.charAt(0).toUpperCase() + field.slice(1)}:
              </label>
              {field === "description" ? (
                <textarea
                  name={field}
                  value={book[field]}
                  onChange={handleChange}
                  style={styles.textarea}
                  rows={4}
                  required
                />
              ) : (
                <input
                  name={field}
                  type={field === "publishedYear" ? "number" : "text"}
                  value={book[field]}
                  onChange={handleChange}
                  style={styles.input}
                  required
                />
              )}
            </div>
          )
        )}
        <button type="submit" style={styles.button}>
          ✅ Update Book
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "40px auto",
    padding: "30px",
    background: "#ffffff",
    border: "1px solid #eaeaea",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#2c3e50",
    fontSize: "24px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    color: "#34495e",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
    backgroundColor: "#fafafa",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
    resize: "vertical",
    backgroundColor: "#fafafa",
  },
  button: {
    marginTop: "10px",
    padding: "12px",
    backgroundColor: "#3498db",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

export default EditBook;
