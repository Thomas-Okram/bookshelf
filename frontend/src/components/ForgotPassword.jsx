import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUp.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );
      setMessage(res.data.message);

      setTimeout(() => {
        // Redirect to Reset Password page passing email in state
        navigate("/reset-password", { state: { email } });
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send reset OTP. Try again."
      );
    }
  };

  return (
    <div className="signup-container">
      <h2>Forgot Password</h2>
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            placeholder="Enter your email"
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" className="signup-btn">
          Send Reset OTP
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
