import React from "react";

import "./Home.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4501/api/v1/course/courses",
          {
            withCredentials: true, // Essential for cookies/auth
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

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
            <h1 className="logo-text">CourseHaven</h1>
          </div>
          <div className="auth-buttons">
            <button className="logout-button">Logout</button>

            <Link to={"/login"} className="login-button">
              Login
            </Link>
            <Link to={"/signup"} className="signup-button">
              Sign Up
            </Link>
          </div>
        </header>

        {/* section 1*/}
        {/* Main section */}
        <section className="main-section">
          <h1 className="main-heading">CourseHaven</h1>

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
                  alt="CourseHaven Logo"
                  className="footer-logo"
                />
                <h1 className="footer-brand-name">CourseHaven</h1>
              </div>
              <div className="social-section">
                <p className="social-title">Follow us</p>
                <div className="social-icons">
                  <a href="#" className="social-link">
                    <FaLinkedin className="facebook-icon" />
                  </a>
                  <a href="#" className="social-link">
                    <FaInstagram className="instagram-icon" />
                  </a>
                </div>
              </div>
            </div>

            <div className="footer-links connects">
              <h3 className="footer-heading">connects</h3>
              <ul className="links-list">
                <li className="link-item">youtube- learn coding</li>
                <li className="link-item">telegram- learn coding</li>
                <li className="link-item">Github- learn coding</li>
              </ul>
            </div>

            <div className="footer-links legal">
              <h3 className="footer-heading">copyrights &#169; 2024</h3>
              <ul className="links-list">
                <li className="link-item">Terms & Conditions</li>
                <li className="link-item">Privacy Policy</li>
                <li className="link-item">Refund & Cancellation</li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
