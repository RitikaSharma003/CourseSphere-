import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import "./OurCourses.css";
import "./UpdateCourse.css";
import { BACKEND_URL } from "../../utils/utils";
function UpdateCourse() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/course/${id}`, {
          withCredentials: true,
        });
        console.log(data);
        setTitle(data.course.title);
        setDescription(data.course.description);
        setPrice(data.course.price);

        const imageUrl = data.course.image?.url;
        if (imageUrl) {
          setImage(imageUrl);
          setImagePreview(imageUrl);
        } else {
          setImage("");
          setImagePreview("");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching course data:", error);
        toast.error("Failed to fetch course data");
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };
  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    if (image instanceof File) {
      formData.append("image", image);
    }
    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin.token;
    if (!token) {
      toast.error("Please login to admin");
      return;
    }
    try {
      const response = await axios.put(
        `${BACKEND_URL}/course/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "Course updated successfully22");
      navigate("/admin/our-courses");
      return;
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.errors);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="update-course-container">
      <div className="update-form-container">
        <h3 className="update-heading">Update Course</h3>
        <form onSubmit={handleUpdateCourse} className="update-form">
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              placeholder="Enter your course title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              placeholder="Enter your course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Price</label>
            <input
              type="number"
              placeholder="Enter your course price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Course Image</label>
            <div className="image-preview-wrapper">
              <img
                src={imagePreview ? `${imagePreview}` : "/imgPL.webp"}
                alt="Course"
                className="course-image-preview"
              />
            </div>
            <input
              type="file"
              onChange={changePhotoHandler}
              className="form-input"
            />
          </div>

          <button type="submit" className="update-button">
            Update Course
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateCourse;
