import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const navigate = useNavigate();

  const quotes = [
    "Believe you can and you're halfway there.",
    "The only way to do great work is to love what you do.",
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "Don't watch the clock; do what it does. Keep going.",
    "Your limitation—it's only your imagination.",
  ];

  // Change quote index every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [quotes.length]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No auth token found, please login.");
          return;
        }

        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Failed to fetch user info.");
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading user info...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Welcome to Bookshelf, {user.name || user.email}!</h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>

      <blockquote
        style={{
          marginTop: "2rem",
          fontStyle: "italic",
          fontSize: "1.2rem",
          color: "#555",
          minHeight: "3rem", // reserve space for smooth text changes
          transition: "opacity 0.5s ease-in-out",
        }}
        key={quoteIndex}
      >
        "{quotes[quoteIndex]}"
      </blockquote>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "2rem",
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          cursor: "pointer",
          backgroundColor: "#dc3545",
          color: "white",
          border: "none",
          borderRadius: "5px",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default HomePage;
