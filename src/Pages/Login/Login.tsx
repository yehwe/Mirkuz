import { useState, FormEvent, ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../Api/api";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import "./Login.css";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  emailError: string;
  passwordError: string;
  serverError: string;
}
interface LoginResponse {
  token: string;
  email: string;
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginFormErrors>({
    emailError: "",
    passwordError: "",
    serverError: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    //validations
    let valid = true;
    const newErrors: LoginFormErrors = {
      emailError: "",
      passwordError: "",
      serverError: "",
    };

    // Email validation
    if (!formData.email) {
      newErrors.emailError = "Please enter your email";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.emailError = "Please enter a valid email address";
      valid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.passwordError = "Please enter your password";
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.passwordError = "Password must be at least 8 characters long";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      return;
    }

    try {
      const { data } = await axios.post<LoginResponse>(
        `${API_BASE_URL}/Login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      localStorage.setItem("token", data.token);
// console.log(data.token);
      // Navigate to home page after successful login
      navigate("/");
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 400) {
          const errorData = error.response.data;
          if (errorData.field === "email") {
            setErrors((prev) => ({
              ...prev,
              emailError: errorData.msg,
              passwordError: "",
            }));
          } else if (errorData.field === "password") {
            setErrors((prev) => ({
              ...prev,
              passwordError: "Incorrect password",
              emailError: "",
            }));
          } else {
            setErrors((prev) => ({
              ...prev,
              serverError: errorData.msg,
            }));
          }
        } else {
          setErrors((prev) => ({
            ...prev,
            serverError: error.response?.data?.msg || "Server error",
          }));
        }
      }
    }
  };

  return (
    <section className="login-hero-section">
<div className="login-left">
<div className="login-left-top">
      <h1 className="welcome-title">
            <span className="blue">Welcome</span>
            <span className="black">Back</span>
          </h1>
          <p className="welcome-desc">sign in and continue from where you left off</p>
</div>
{/* <div className="login-left-bottom">
    <div className="bottom-links-left">
            <Link to="/find-volunteer" className="bottom-link">Find Volunteer</Link>
            <Link to="/create-event" className="bottom-link">create Event</Link>
          </div>
</div> */}
</div>


      <div className="login-right">
        <div className="login-right-top">
          <div className="contact-title">
            <h2>Sign in!</h2>
          </div>
          <div className="form-column">
            <div className="contact-form">
              <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  {errors.serverError && (
                    <div className="error-message" role="alert">
                      {errors.serverError}
                    </div>
                  )}
                  <div
                    className={`form-field ${errors.emailError ? "error" : ""}`}
                  >
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.emailError && (
                      <div className="error-message">{errors.emailError}</div>
                    )}
                  </div>

                  <div
                    className={`form-field ${
                      errors.passwordError ? "error" : ""
                    }`}
                  >
                    <div className="password-input">
                      <label className="form-label">Password</label>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="password-field"
                      />
                      <span
                        className="toggle-password"
                        onClick={togglePasswordVisibility}
                        style={{ cursor: "pointer" }}
                      >
                        {showPassword ? (
                          <VisibilityOff fontSize="small" />
                        ) : (
                          <Visibility fontSize="small" />
                        )}
                      </span>
                    </div>
                    {errors.passwordError && (
                      <div className="error-message">
                        {errors.passwordError}
                      </div>
                    )}
                  </div>
                   <div className="form-group">
                <Link to="/forgot-password" className="forgot-password-link">
                  Forgot Password?
                </Link>
              </div>
                  <button
                     type="submit" 
                className="button-primary"
                // disabled={isSubmitting}
              >
                Sign in
                  </button>
                </div>
              </form>
             
            </div>
          </div>
        </div>
        {/* <div className="login-right-bottom">  <div className="bottom-links-right">
            <Link to="/find-volunteer" className="bottom-link">Raise Donation</Link>
            <Link to="/create-event" className="bottom-link"> AND More</Link>
          </div>
          </div> */}
      </div>
     
    </section>
  );
};

export default Login;