import axios from "axios";
import React, { useState } from "react";
import "./CourseCreate.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../utils/utils";
function CourseCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const navigate = useNavigate();

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);

    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin.token;
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/course/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
      toast.success(response.data.message || "Course created successfully");
      navigate("/admin/our-courses");
      setTitle("");
      setPrice("");
      setImage("");
      setDescription("");
      setImagePreview("");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.errors);
    }
  };
  return (
    <div className="course-form-container">
      <div className="form-box">
        <h3 className="form-heading">Create Course</h3>

        <form onSubmit={handleCreateCourse} className="course-form">
          <div className="form-field">
            <label className="form-label">Title</label>
            <input
              type="text"
              placeholder="Enter your course title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Description</label>
            <input
              type="text"
              placeholder="Enter your course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Price</label>
            <input
              type="number"
              placeholder="Enter your course price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="form-field">
            <label className="form-label">Course Image</label>
            <div className="image-preview-container">
              <img
                src={imagePreview ? `${imagePreview}` : "/imgPL.webp"}
                alt="Image"
                className="image-preview"
              />
            </div>
            <input
              type="file"
              onChange={changePhotoHandler}
              className="form-input"
            />
          </div>

          <button type="submit" className="submit-button">
            Create Course
          </button>
        </form>
      </div>
    </div>
  );
}

export default CourseCreate;
