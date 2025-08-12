import React from "react";
import "slick-carousel/slick/slick.css";
import { FaCircleUser } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import "./Dashboard.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../utils/utils";
import logo from "../../public/logo.webp";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
const Dashboard = () => {
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
      const response = await axios.get(`${BACKEND_URL}/admin/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("admin");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };
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
      <aside
        className={`sidebar-dashboard ${isSidebarOpen ? "sidebar-open" : ""}`}
      >
        <div className="sidebar-dashboard-logo-container">
          <img src={logo} alt="Profile" className="profile-img" />
          <p className="admin-text">I 'm Admin </p>
        </div>
        <nav>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/admin/our-courses" className="nav-link ">
                <FaDiscourse className="nav-icon" />
                Our Courses
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/create-course" className="nav-link">
                <FaDownload className="nav-icon" /> Create Course
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/" className="nav-link">
                <IoMdSettings className="nav-icon" /> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to={"/admin/login"}
                className="nav-link"
                onClick={handleLogout}
              >
                <IoLogOut className="nav-icon" /> Logout
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="main-content-area-welcome">
        <header className="content-header-welcome">
          <h1 className="content-title-welcome">Welcome To Dashboard </h1>
          <div></div>
        </header>
      </main>
    </div>
  );
};
export default Dashboard;
