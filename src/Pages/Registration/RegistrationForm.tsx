import React, { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate} from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../Api/api";
import "./Registration.css";

interface FormData {
  org_name: string;
  org_website: string;
  password: string;
  org_email: string;
  role: string;
  phone_no: string;
  confirmPassword: string;
}

interface FormErrors {
  org_name?: string;
  org_website?: string;
  org_email?: string;
  phone_no?: string;
  password?: string;
  confirmPassword?: string;
  submit?: string;
}

const RegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    org_name: "",
    org_website: "",
    password: "",
    org_email: "",
    role: "CHARITHY",
    phone_no: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^\d{10,13}$/;
    return phoneRegex.test(phone);
  };

  const isStrongPassword = (password: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const isValidWebsite = (website: string): boolean => {
    const websiteRegex = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-]*)*$/;
    return websiteRegex.test(website);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newErrors: FormErrors = {};

    if (!formData.org_name) {
      newErrors.org_name = "Organization name is required.";
    }

    if (!isValidWebsite(formData.org_website)) {
      newErrors.org_website = "Please enter a valid website URL.";
    }

    if (!isValidEmail(formData.org_email)) {
      newErrors.org_email = "Please enter a valid email address.";
    }

    if (!isValidPhoneNumber(formData.phone_no)) {
      newErrors.phone_no = "Phone number must be between 10 to 13 digits.";
    }

    if (!isStrongPassword(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters long and include both uppercase and lowercase letters.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const { confirmPassword: _, ...dataToSend } = formData;
      
      // First, send registration data and request OTP
      const response = await axios.post(`${API_BASE_URL}/registerchairty`, {
        ...dataToSend,
        requestOTP: true // Add this flag to indicate OTP is needed
      
      });
      localStorage.setItem("email", formData.org_email);
      console.log(response.data);
      navigate("/verify");
    } catch (error) {
      console.error("Registration error:", error);
      setErrors((prevErrors) => ({
        ...prevErrors,
        submit: "Registration failed. Please try again later.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="registration-main">
        {/* Left Side: Welcome and Bottom Links */}
        <div className="registration-left">
          <h1 className="welcome-title">
            <span className="blue">Let's get</span>
            <span className="black">you started.</span>
          </h1>
          <p className="welcome-desc">Register Now – Meet Volunteers Ready to Help</p>
         
        </div>
        {/* Right Side: Registration Form with overlay */}
        <div className="registration-right">
          <div className="registration-form-container">
            <div className="registration-form-title">Sign up!</div>
            <form className="registration-form" onSubmit={handleSubmit}>
              <div className="reg-form-group">
                <label className="reg-form-label">Organization Name</label>
                <input
                  type="text"
                  name="org_name"
                  value={formData.org_name}
                  onChange={handleChange}
                  required
                />
                {errors.org_name && <div className="error-message">{errors.org_name}</div>}
              </div>
              <div className="reg-form-group">
                <label className="reg-form-label">Organization website</label>
                <input
                  type="text"
                  name="org_website"
                  value={formData.org_website}
                  onChange={handleChange}
                  required
                />
                {errors.org_website && <div className="error-message">{errors.org_website}</div>}
              </div>
              <div className="reg-form-group">
                <label className="reg-form-label">Organization Email</label>
                <input
                  type="email"
                  name="org_email"
                  value={formData.org_email}
                  onChange={handleChange}
                  required
                />
                {errors.org_email && <div className="error-message">{errors.org_email}</div>}
              </div>
              <div className="reg-form-group">
                <label className="reg-form-label">Phone Number</label>
                <input
                  type="text"
                  name="phone_no"
                  value={formData.phone_no}
                  onChange={handleChange}
                  required
                />
                {errors.phone_no && <div className="error-message">{errors.phone_no}</div>}
              </div>
              <div className="reg-form-group">
                <label className="reg-form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Choose strong password"
                />
                {errors.password && <div className="error-message">{errors.password}</div>}
              </div>
              <div className="reg-form-group">
                <label className="reg-form-label">Confirm password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
              </div>
              {errors.submit && <div className="error-message">{errors.submit}</div>}
              {/* {successMessage && <div className="success-text">{successMessage}</div>} */}
              <button 
                type="submit" 
                className="button-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Loading...' : 'Signup'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegistrationForm;
