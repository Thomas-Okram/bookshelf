import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUp.css"; // or your own styling

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const emailFromState = location.state?.email || "";

  const [email, setEmail] = useState(emailFromState);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email,
          otp,
        }
      );
      setMessage(res.data.message);

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Verification failed");
      } else {
        setError("Server error");
      }
    }
  };

  return (
    <div className="signup-container">
      <h2>Verify Your Email</h2>
      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            readOnly={!!emailFromState} // prevent editing if email passed via state
          />
        </div>
        <div className="form-group">
          <label>OTP Code:</label>
          <input
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter your CODE"
            required
            minLength={6}
            maxLength={6}
          />
        </div>
        <button type="submit" className="signup-btn">
          Verify
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
