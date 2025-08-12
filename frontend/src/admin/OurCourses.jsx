import axios from "axios";
import React, { useEffect, useState } from "react";
import "./OurCourses.css";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../utils/utils";
const OurCourses = () => {
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin"));
  const token = admin.token;

  if (!token) {
    toast.error("Please login to admin");
    navigate("/admin/login");
  }

  // fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        console.log(response.data.course);
        setCourse(response.data.course);
        setLoading(false);
      } catch (error) {
        console.log("error in fetchCourses ", error);
      }
    };
    fetchCourses();
  }, []);

  // delete courses code
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/course/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      const updatedCourse = course.filter((course) => course._id !== id);
      setCourse(updatedCourse);
    } catch (error) {
      console.log("Error in deleting course ", error);
      toast.error(error.response.data.errors || "Error in deleting course");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }
  return (
    <div className="courses-container-admin">
      <h1 className="courses-heading">Our Courses</h1>
      <Link className="dashboard-link" to={"/admin/dashboard"}>
        Go to dashboard
      </Link>
      <div className="courses-grid">
        {course.map((course) => (
          <div key={course._id} className="course-card-admin">
            {/* Course Image */}
            <img
              src={course?.image?.url}
              alt={course.title}
              className="course-image"
            />
            {/* Course Title */}
            <h2 className="course-title">{course.title}</h2>
            {/* Course Description */}
            <p className="course-description">
              {course.description.length > 200
                ? `${course.description.slice(0, 200)}...`
                : course.description}
            </p>
            {/* Course Price */}
            <div className="price-container">
              <div className="current-price">
                ₹{course.price} <span className="original-price">₹300</span>
              </div>
              <div className="discount">10 % off</div>
            </div>

            <div className="action-buttons">
              <Link
                to={`/admin/update-course/${course._id}`}
                className="update-button"
              >
                Update
              </Link>
              <button
                onClick={() => handleDelete(course._id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurCourses;
