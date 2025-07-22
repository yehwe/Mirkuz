import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../Api/api";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

interface ForgotPasswordFormData {
  email: string;
}

interface VerifyOtpFormData {
  email: string;
  Otp: string;
}

interface ResetPasswordFormData {
  email: string;
  Otp: string;
  newPassword: string;
  confirmPassword: string;
}

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Step 1: Email state
  const [emailData, setEmailData] = useState<ForgotPasswordFormData>({
    email: "",
  });
  const [emailError, setEmailError] = useState("");

  // Step 2: OTP verification state
  const [otpData, setOtpData] = useState<VerifyOtpFormData>({
    email: "",
    Otp: "",
  });
  const [otpError, setOtpError] = useState("");

  // Step 3: Password reset state
  const [passwordData, setPasswordData] = useState<ResetPasswordFormData>({
    email: "",
    Otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  // Step 1: Handle email input and OTP request
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmailData({ email: value });
    setEmailError("");
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Email validation
    if (!/\S+@\S+\.\S+/.test(emailData.email)) {
      setEmailError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/forgotpassword`,
        emailData
      );
      if (response.data && response.data.msg) {
        setSuccessMessage(response.data.msg);
        // Store email for next steps
        setOtpData((prev) => ({ ...prev, email: emailData.email }));
        setPasswordData((prev) => ({ ...prev, email: emailData.email }));
        
      }
      setStep(2);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.msg || "Failed to send OTP");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle OTP verification
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOtpData((prev) => ({ ...prev, Otp: value }));
    setOtpError("");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/verifyOtp`, otpData);
      if (response.data && response.data.msg) {
        setSuccessMessage(response.data.msg);
        // Store OTP for password reset
        setPasswordData((prev) => ({ ...prev, Otp: otpData.Otp }));
      
      }
        setStep(3);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.msg || "Invalid OTP");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Handle password reset
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    setPasswordError("");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Password validation
    if (passwordData.newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/resetPassword`, {
        email: passwordData.email,
        otp: passwordData.Otp,
        newPassword: passwordData.newPassword,
      });

      if (response.data && response.data.msg) {
        setSuccessMessage(response.data.msg);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.msg || "Failed to reset password");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="forgot-password-section">
      <div className="forgot-password-container">
        <div className="forgot-password-title">
          <h2>Reset Password</h2>
        </div>
        <div className="forgot-password-form-wrapper">
          <div className="forgot-password-form">
            {step === 1 && (
              <form onSubmit={handleRequestOTP}>
                <div className="form-group">
                  <input
                    type="email"
                    value={emailData.email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                    className={emailError ? "input-error" : ""}
                  />
                  {emailError && (
                    <div className="field-error">{emailError}</div>
                  )}
                </div>
                {error && <div className="validation-error">{error}</div>}
                {successMessage && (
                  <div className="success-message">{successMessage}</div>
                )}
                <div className="form-group">
                  <button
                    type="submit"
                    className="forgot-password-btn"
                    disabled={loading || !!emailError}
                  >
                    {loading ? "Sending OTP..." : "Request OTP"}
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp}>
                <div className="form-group">
                  <input
                    type="text"
                    value={otpData.Otp}
                    onChange={handleOtpChange}
                    placeholder="Enter OTP"
                    required
                    disabled={loading}
                  />
                  {otpError && <div className="field-error">{otpError}</div>}
                </div>
                {error && <div className="validation-error">{error}</div>}
                {successMessage && (
                  <div className="success-message">{successMessage}</div>
                )}
                <div className="form-group">
                  <button
                    type="submit"
                    className="forgot-password-btn"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="New Password"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Confirm Password"
                    required
                    disabled={loading}
                  />
                  {passwordError && (
                    <div className="field-error">{passwordError}</div>
                  )}
                </div>
                {error && <div className="validation-error">{error}</div>}
                {successMessage && (
                  <div className="success-message">{successMessage}</div>
                )}
                <div className="form-group">
                  <button
                    type="submit"
                    className="forgot-password-btn"
                    disabled={loading}
                  >
                    {loading ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ForgotPassword;
