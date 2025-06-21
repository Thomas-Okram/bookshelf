import React, { useState } from "react";

const AddBook = () => {
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    description: "",
    publishedYear: "",
  });
  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("❌ You must be logged in as admin.");
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (coverImage) {
      formData.append("coverImage", coverImage);
    }

    try {
      const res = await fetch("http://localhost:5000/api/books/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Book added successfully!");
        setForm({
          title: "",
          author: "",
          genre: "",
          description: "",
          publishedYear: "",
        });
        setCoverImage(null);
        setPreview(null);
      } else {
        setMessage(`❌ ${data.message || "Something went wrong"}`);
      }
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setMessage("❌ Network error");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Add New Book</h2>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        style={styles.form}
      >
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Book Title"
          required
          style={styles.input}
        />
        <input
          name="author"
          value={form.author}
          onChange={handleChange}
          placeholder="Author"
          style={styles.input}
        />
        <input
          name="genre"
          value={form.genre}
          onChange={handleChange}
          placeholder="Genre"
          style={styles.input}
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Book Description"
          rows="4"
          style={styles.textarea}
        />
        <input
          name="publishedYear"
          value={form.publishedYear}
          onChange={handleChange}
          placeholder="Published Year"
          type="number"
          style={styles.input}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={styles.fileInput}
        />
        {preview && (
          <img src={preview} alt="Preview" style={styles.imagePreview} />
        )}
        <button type="submit" style={styles.button}>
          📚 Add Book
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "2rem auto",
    padding: "2rem",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "1.5rem",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    marginBottom: "1rem",
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  textarea: {
    marginBottom: "1rem",
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "5px",
    border: "1px solid #ccc",
    resize: "vertical",
  },
  fileInput: {
    marginBottom: "1rem",
  },
  imagePreview: {
    width: "100%",
    height: "auto",
    objectFit: "cover",
    borderRadius: "5px",
    marginBottom: "1rem",
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "0.75rem",
    fontSize: "1rem",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  message: {
    marginTop: "1rem",
    textAlign: "center",
    fontWeight: "bold",
    color: "#333",
  },
};

export default AddBook;
