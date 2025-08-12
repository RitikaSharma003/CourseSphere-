import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx";
import Login from "./components/Login.jsx";
import { Toaster } from "react-hot-toast";
import Signup from "./components/Signup.jsx";
import Courses from "./components/Courses.jsx";
import Buy from "./components/Buy.jsx";
import Purchases from "./components/Purchases.jsx";

import AdminSignup from "./admin/AdminSignup";
import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/Dashboard";
import CourseCreate from "./admin/CourseCreate";
import UpdateCourse from "./admin/UpdateCourse";
import OurCourses from "./admin/OurCourses";

const App = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const admin = JSON.parse(localStorage.getItem("admin"));

  return (
    <>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Other Routes */}
          <Route path="/courses" element={<Courses />} />
          <Route path="/buy/:courseId" element={<Buy />} />
          <Route path="/purchases" element={<Purchases />} />
          {/*         you can use below one if required 
 <Route
          path="/purchases"
          element={user ? <Purchases /> : <Navigate to={"/login"} />}
        />*/}

          {/* Admin Routes */}
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={admin ? <Dashboard /> : <Navigate to={"/admin/login"} />}
          />
          <Route path="/admin/create-course" element={<CourseCreate />} />
          <Route path="/admin/update-course/:id" element={<UpdateCourse />} />
          <Route path="/admin/our-courses" element={<OurCourses />} />
        </Routes>
        <Toaster />
      </div>
    </>
  );
};

export default App;
