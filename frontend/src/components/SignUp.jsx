import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUp.css";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { email, name, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        email,
        name,
        password,
      });
      setMessage(res.data.message);
      setFormData({ email: "", name: "", password: "" });

      // Redirect to verify OTP page, passing email via state
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      if (err.response && err.response.data) {
        setError(
          err.response.data.message ||
            (err.response.data.errors && err.response.data.errors[0].msg) ||
            "Registration failed"
        );
      } else {
        setError("Server error");
      }
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
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
          <label>Name:</label>
          <input
            name="name"
            value={name}
            onChange={onChange}
            placeholder="Enter your Full-Name"
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            placeholder="Enter your Password"
            required
            minLength={6}
          />
        </div>
        <button type="submit" className="signup-btn">
          Register
        </button>
      </form>
      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <p>
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
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
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;
