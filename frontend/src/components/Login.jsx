import React from "react";
import "./login.css";
import logo from "../../public/logo.webp";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../utils/utils";
import axios from "axios";
import { useState } from "react";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = (e) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Prevent event bubbling
    setShowPassword((prev) => !prev); // Toggle state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e.target.value);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Login successful!", response.data);
      toast.success(response.data.message);
      // store the token on browser local storage
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.errors || "Login failed !!");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <header className="login-header">
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo-img" />
            <Link to={"/"} className="logo-text">
              CourseSphere
            </Link>
          </div>
          <div className="nav-buttons">
            <Link to={"/signup"} className="signup-btn">
              Signup
            </Link>
            <Link to={"/courses"} className="join-btn">
              Join now
            </Link>
          </div>
        </header>

        {/* Login Form */}
        <div className="login-form">
          <h2 className="form-title">
            Welcome to <span className="highlight">CourseSphere</span>
          </h2>
          <p className="form-subtitle">Log in to access paid content!</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="input-label">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="name@email.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="********"
                  required
                />
                <span
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  style={{ cursor: "pointer" }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </div>
            </div>
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
            <button type="submit" className="submit-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
