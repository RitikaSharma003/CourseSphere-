import React from "react";
import "./Signup.css";
import logo from "../../public/logo.webp";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
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
        "http://localhost:4501/api/v1/user/signup",
        {
          firstName,
          lastName,
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
      console.log("Signup successful!", response.data);
      alert(response.data.message);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.errors);
        setErrorMessage(error.response.data.errors || "Signup failed !!");
      }
    }
  };
  return (
    <div className="signup-container">
      <div className="main-content">
        {/* Header */}
        <header className="page-header">
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo-img" />
            <Link to={"/"} className="logo-text">
              CourseHaven
            </Link>
          </div>
          <div className="nav-buttons">
            <Link to={"/login"} className="login-btn">
              Login
            </Link>
            <Link to={"/courses"} className="join-btn">
              Join now
            </Link>
          </div>
        </header>

        {/* Signup Form */}
        <div className="signup-form">
          <h2 className="form-title">
            Welcome to <span className="highlight">CourseHaven</span>
          </h2>
          <p className="form-subtitle">Just Signup To Join Us!</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="firstname" className="input-label">
                Firstname
              </label>
              <input
                type="text"
                id="firstname"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="form-input"
                placeholder="Type your firstname"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastname" className="input-label">
                Lastname
              </label>
              <input
                type="text"
                id="lastname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="form-input"
                placeholder="Type your lastname"
                required
              />
            </div>

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
              Signup
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
