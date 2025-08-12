import React from "react";

import "./Home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BACKEND_URL } from "../../utils/utils";
import toast from "react-hot-toast";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import axios from "axios";
import { useEffect, useState } from "react";
import logo from "../../public/logo.webp";
import { Link } from "react-router-dom";
function Home() {
  const [course, setCourse] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true, // Essential for cookies/auth
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        console.log("Courses:", response.data.course);
        setCourse(response.data.course || response.data.courses || []);
      } catch (error) {
        console.error("error in fetchCourses", error);
      }
    };

    fetchCourses();
  }, []);

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <div className="hero-gradient-background">
      <div className="hero-container">
        {/* Header */}
        <header className="page-header">
          <div className="logo-container">
            <img src={logo} alt="CourseHaven Logo" className="logo-image" />
            <h1 className="logo-text">CourseSphere</h1>
          </div>
          <div className="admin-access-container">
            <Link to="/admin/login" className="admin-access-button">
              Admin
            </Link>
          </div>
          <div className="auth-buttons">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            ) : (
              <>
                <Link to={"/login"} className="login-button">
                  Login
                </Link>
                <Link to={"/signup"} className="signup-button">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </header>

        {/* section 1*/}
        {/* Main section */}
        <section className="main-section">
          <h1 className="main-heading">CourseSphere</h1>

          <br />
          <p className="main-subtitle">
            Sharpen your skills with courses crafted by experts.
          </p>
          <div className="button-container">
            <Link to={"/courses"} className="primary-button">
              Explore courses
            </Link>
            <Link
              to={"https://www.youtube.com/learncodingofficial"}
              className="secondary-button"
            >
              Courses videos
            </Link>
          </div>
        </section>
        <section className="courses-section">
          <Slider className="courses-slider" {...settings}>
            {course.map((course) => (
              <div key={course._id} className="slide-wrapper">
                <div className="course-card">
                  <img
                    className="course-image"
                    src={course.image.url}
                    alt={course.title}
                  />
                  <div className="course-content">
                    <h2 className="course-title">{course.title}</h2>
                    <Link to={`/buy/${course._id}`} className="enroll-button">
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>
        <hr />
        {/* Footer */}

        <hr className="footer-divider" />
        <footer className="site-footer">
          <div className="footer-container">
            <div className="footer-brand">
              <div className="logo-wrapper">
                <img
                  src={logo}
                  alt="CourseSphere Logo"
                  className="footer-logo"
                />
                <h1 className="footer-brand-name">CourseSphere</h1>
              </div>
              <div className="social-section">
                <p className="social-title">Follow me</p>
                <div className="social-icons">
                  <a
                    href="https://www.linkedin.com/in/ritika-sharma-62652023b/"
                    className="social-link"
                  >
                    <FaLinkedin className="facebook-icon" />
                  </a>
                  <a
                    href="https://www.instagram.com/ritika_sha_.rma/"
                    className="social-link"
                  >
                    <FaInstagram className="instagram-icon" />
                  </a>
                </div>
              </div>
            </div>

            <div className="footer-links connects">
              <h3 className="footer-heading">connects</h3>
              <ul className="links-list">
                <a
                  href="https://github.com/RitikaSharma003"
                  className="link-item"
                >
                  My Github
                </a>
              </ul>
            </div>

            <div className="footer-links legal">
              <h3 className="footer-heading">copyrights &#169; 2025</h3>
              <ul className="links-list">
                <li className="link-item">Terms & Conditions</li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
