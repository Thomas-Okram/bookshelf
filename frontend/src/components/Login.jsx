import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUp.css"; // reuse your styles or customize

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      setMessage("Login successful!");

      localStorage.setItem("token", res.data.token);

      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(
          err.response.data.message ||
            (err.response.data.errors && err.response.data.errors[0].msg) ||
            "Login failed"
        );
      } else {
        setError("Server error");
      }
    }
  };

  return (
    <div className="signup-container">
      <h2>Login</h2>
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            placeholder="Enter a Strong Password"
            required
            minLength={6}
          />
        </div>

        {/* Forgot Password link just below password field */}
        <div style={{ textAlign: "right", marginBottom: "1rem" }}>
          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
              cursor: "pointer",
              textDecoration: "underline",
              padding: 0,
              fontSize: "0.9rem",
            }}
          >
            Forgot Password?
          </button>
        </div>

        <button type="submit" className="signup-btn">
          Login
        </button>
      </form>

      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <p>
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/")}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
              cursor: "pointer",
              textDecoration: "underline",
              padding: 0,
              fontSize: "1rem",
            }}
          >
            Signup
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
