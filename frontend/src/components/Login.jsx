import React from "react";
import "./login.css";
import logo from "../../public/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  return (
    <div className="login-container">
      <div className="login-wrapper">
        <header className="login-header">
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo-img" />
            <Link to={"/"} className="logo-text">
              CourseHaven
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
            Welcome to <span className="highlight">CourseHaven</span>
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
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  placeholder="********"
                  required
                />
                <span className="password-toggle">👁️</span>
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
