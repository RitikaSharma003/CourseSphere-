import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { BACKEND_URL } from "../../utils/utils";
import "./Purchases.css";
import { RiHome2Fill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi"; // Icons for sidebar toggle
import { Link, useNavigate } from "react-router-dom";
function Purchases() {
  const [purchases, setPurchase] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar open state

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token; // using optional chaining to avoid app crashing

  console.log("purchases: ", purchases);

  // Token handling
  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch purchases
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    setErrorMessage(null);
    const fetchPurchases = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/user/purchases`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setPurchase(response.data.courseData);
      } catch (error) {
        setErrorMessage("Failed to fetch purchase data");
      }
    };
    fetchPurchases();
  }, [token, navigate]);
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      navigate("/login");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="purchases-container">
      {/* Sidebar */}
      <div className={`sidebars ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <nav>
          <ul className="nav-list">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                <RiHome2Fill className="nav-icon" /> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/courses" className="nav-link">
                <FaDiscourse className="nav-icon" /> Courses
              </Link>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link active">
                <FaDownload className="nav-icon" /> Purchases
              </a>
            </li>
            <li className="nav-item">
              <Link to="/settings" className="nav-link">
                <IoMdSettings className="nav-icon" /> Settings
              </Link>
            </li>
            <li className="nav-item">
              {isLoggedIn ? (
                <button onClick={handleLogout} className="nav-link-logout">
                  <IoLogOut className="nav-icon" /> Logout
                </button>
              ) : (
                <Link to="/login" className="nav-link">
                  <IoLogIn className="nav-icon" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Sidebar Toggle Button (Mobile) */}
      <button className="mobile-menu-btn" onClick={toggleSidebar}>
        {isSidebarOpen ? (
          <HiX className="menu-icon" />
        ) : (
          <HiMenu className="menu-icon" />
        )}
      </button>

      {/* Main Content */}
      <div
        className={`main-content-area ${
          isSidebarOpen ? "sidebar-open-content" : ""
        }`}
      >
        <div className="content-header">
          <h2 className="content-title">My Purchases</h2>
        </div>

        {/* Error message */}
        {errorMessage && <div className="error-message">{errorMessage}</div>}

        {/* Render purchases */}
        {purchases.length > 0 ? (
          <div className="purchases-grid">
            {purchases.map((purchase, index) => (
              <div key={index} className="purchase-card">
                <div className="purchase-card-content">
                  {/* Course Image */}
                  <img
                    className="purchase-image"
                    src={
                      purchase.image?.url || "https://via.placeholder.com/200"
                    }
                    alt={purchase.title}
                  />
                  <div className="purchase-details">
                    <h3 className="purchase-title">{purchase.title}</h3>
                    <p className="purchase-description">
                      {purchase.description.length > 100
                        ? `${purchase.description.slice(0, 100)}...`
                        : purchase.description}
                    </p>
                    <span className="purchase-price">
                      ${purchase.price} only
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-purchases">You have no purchases yet.</p>
        )}
      </div>
    </div>
  );
}
export default Purchases;
