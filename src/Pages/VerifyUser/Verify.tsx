import React, { useState, FormEvent, ChangeEvent, useEffect } from "react";
import {useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../Api/api";
import "./Verify.css";
import { Link } from "react-router-dom";

const VerifyForm: React.FC = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [timer, setTimer] = useState(180); // 3 minutes in seconds
  const [otpExpired, setOtpExpired] = useState(false);
  const email = localStorage.getItem("email") || "";
  const navigate = useNavigate();

  useEffect(() => {
    if (timer <= 0) {
      setOtpExpired(true);
      return;
    }
    setOtpExpired(false);
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!code) {
      setError("Please enter the code.");
      return;
    }
    if (otpExpired) {
      setError("OTP expired. Please resend OTP.");
      return;
    }
    setIsVerifying(true);
    try {
      // Verify OTP and complete registration
      const response = await axios.post(`${API_BASE_URL}/verifyOtp`, {
        otp: code,
        email: localStorage.getItem("email"),
      });
      navigate("/login");
      if (response.data) {
        localStorage.removeItem("email");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setError("Invalid verification code. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await axios.post(`${API_BASE_URL}/verifyOtp`, { email });
      setError("New OTP has been sent to your email.");
      setTimer(180); // Reset timer to 3 minutes
      setOtpExpired(false);
    } catch (error) {
      setError("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <>
      <div className="verify-main">
        {/* Left Side: Welcome and Bottom Links */}
        <div className="verify-left">
          <h1 className="welcome-title">
            <span className="blue">Let's get</span>
            <span className="black">you started.</span>
          </h1>
          <p className="welcome-desc">
            Register Now – Meet Volunteers Ready to Help
          </p>
        </div>
       
        <div className="verify-right">
          <div className="verify-form-container">
            <h2 className="verify-title">Verify Account</h2>
            <div className="verify-message">
              Code has been sent to the email <b>{email}</b>.<br />
              Enter the code to verify your account
            </div>
            <div style={{ color: otpExpired ? '#e74c3c' : '#2563eb', fontWeight: 600, marginBottom: 12 }}>
              {otpExpired ? 'OTP expired' : `OTP expires in: ${formatTime(timer)}`}
            </div>
            <form className="verify-form" onSubmit={handleSubmit}>
              <label className="verify-label">Enter Code</label>
              <input
                type="text"
                className="verify-input"
                value={code}
                onChange={handleChange}
                placeholder="Enter code"
                disabled={otpExpired}
              />
              {error && <div className="error-message">{error}</div>}
              <button
                type="submit"
                className="verify-btn"
                disabled={isVerifying || otpExpired}
              >
                {isVerifying ? "Verifying..." : "Verify"}
              </button>
              <button
                type="button"
                className="resend-btn"
                onClick={handleResendOTP}
              >
                Resend OTP
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="bottom-links">
        <div className="bottom-links-left">
          <Link to="/find-volunteer" className="bottom-link">
            Find Volunteer
          </Link>
          <Link to="/create-event" className="bottom-link">
            create Event
          </Link>
        </div>
        <div className="bottom-links-right">
          <Link to="/find-volunteer" className="bottom-link">
            Raise Donation
          </Link>
          <Link to="/create-event" className="bottom-link">
            {" "}
            AND More
          </Link>
        </div>
      </div>
    </>
  );
};

export default VerifyForm;
