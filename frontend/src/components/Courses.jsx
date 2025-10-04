import React from "react";
import "slick-carousel/slick/slick.css";
import { FaCircleUser } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse } from "react-icons/fa";
import { BACKEND_URL } from "../../utils/utils";
import { FaDownload } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import "./Courses.css";
import axios from "axios";
import { useEffect, useState } from "react";
import logo from "../../public/logo.webp";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
const Courses = () => {
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  console.log("courses:", course);

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
        setLoading(false);
      } catch (error) {
        console.error("error in fetchCourses", error);
      }
    };

    fetchCourses();
  }, []);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="courses-container">
      {/* Hamburger menu button for mobile */}
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        {isSidebarOpen ? <HiX /> : <HiMenu />}
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-logo-container">
          <img src={logo} alt="Profile" className="profile-img" />
        </div>
        <nav>
          <ul className="nav-list">
            <li className="nav-item">
              <a href="/" className="nav-link">
                <RiHome2Fill className="nav-icon" /> Home
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link active">
                <FaDiscourse className="nav-icon" /> Courses
              </a>
            </li>
            <li className="nav-item">
              <Link to="/purchases" className="nav-link">
                <FaDownload className="nav-icon" /> Purchases
              </Link>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                <IoMdSettings className="nav-icon" /> Settings
              </a>
            </li>
            <li className="nav-item">
              {isLoggedIn ? (
                <Link to={"/"} className="nav-link" onClick={handleLogout}>
                  <IoLogOut className="nav-icon" /> Logout
                </Link>
              ) : (
                <Link to={"/login"} className="nav-link">
                  <IoLogIn className="nav-icon" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="main-content-area">
        <header className="content-header">
          <h1 className="content-title">Courses</h1>
          <div className="header-actions">
            <div className="search-container">
              <input
                type="text"
                placeholder="Type here to search..."
                className="search-input"
              />
              <button className="search-button">
                <FiSearch className="search-icon" />
              </button>
            </div>
            <FaCircleUser className="user-icon" />
          </div>
        </header>

        {/* Vertically Scrollable Courses Section */}
        <div className="courses-scroll-container">
          {loading ? (
            <p className="loading-text">Loading...</p>
          ) : course.length === 0 ? (
            <p className="empty-courses-text">No course posted yet by admin</p>
          ) : (
            <div className="courses-grid">
              {course.map((course) => (
                <div key={course._id} className="course-card">
                  <img
                    src={course.image.url}
                    alt={course.title}
                    className="course-image"
                  />
                  <h2 className="course-title">{course.title}</h2>
                  <p className="course-description">
                    {course.description.length > 100
                      ? `${course.description.slice(0, 100)}...`
                      : course.description}
                  </p>
                  <div className="price-container">
                    <span className="current-price">
                      ₹{course.price}{" "}
                      <span className="original-price">5999</span>
                    </span>
                    <span className="discount">20% off</span>
                  </div>

                  <Link to={`/buy/${course._id}`} className="buy-button">
                    Buy Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
export default Courses;
