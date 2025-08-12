import { Course } from "../models/course.model.js";
import { v2 as cloudinary } from "cloudinary";

import { Purchase } from "../models/purchase.model.js";
import Stripe from "stripe";
import config from "../config.js";
export const createCourse = async (req, res) => {
  const adminId = req.adminId;
  const { title, description, price } = req.body;
  console.log(title, description, price);
  try {
    if (!title || !description || !price) {
      return res.status(400).json({ errors: "All fields are required" });
    }
    const { image } = req.files;
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ errors: "No image file uploaded" });
    }

    const allowedFormat = ["image/jpeg", "image/png", "image/jpg"];

    if (!allowedFormat.includes(image.mimetype)) {
      return res.status(400).json({ errors: "Invalid image format" });
    }

    // cloudinary code

    const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);
    if (!cloud_response || cloud_response.error) {
      return res.status(400).json({ errors: "Error uploading image to cloud" });
    }

    const courseData = {
      title,
      description,
      price,
      image: {
        public_id: cloud_response.public_id,
        url: cloud_response.url,
      },
      creatorId: adminId,
    };

    const course = await Course.create(courseData);

    res.json({ message: "Course created successfully", course });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: " error creating by course" });
  }
};

export const UpdateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  const { title, description, price } = req.body;

  try {
    const courseSearch = await Course.findById(courseId);
    if (!courseSearch) {
      return res
        .status(404)
        .json({ errors: "Can't update , created by other admin" });
    } // Prepare the update object with fields from req.body

    const updateData = {
      title,
      description,
      price,
    }; // Check if a new image file was uploaded by your file-upload middleware

    if (req.files && req.files.image) {
      const { image } = req.files; // Validate image format

      const allowedFormat = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowedFormat.includes(image.mimetype)) {
        return res.status(400).json({ errors: "Invalid image format" });
      } // Delete the old image from Cloudinary if it exists

      if (courseSearch.image && courseSearch.image.public_id) {
        await cloudinary.uploader.destroy(courseSearch.image.public_id);
      } // Upload the new image to Cloudinary

      const cloud_response = await cloudinary.uploader.upload(
        image.tempFilePath
      );
      if (!cloud_response || cloud_response.error) {
        return res
          .status(400)
          .json({ errors: "Error uploading new image to cloud" });
      }

      updateData.image = {
        public_id: cloud_response.public_id,
        url: cloud_response.url,
      };
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      { _id: courseId, creatorId: adminId },
      updateData,
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Course updated successfully", course: updatedCourse });
  } catch (error) {
    console.error("error in course updating ", error);
    res.status(500).json({ errors: "Error updating course" });
  }
};

export const deleteCourse = async (req, res) => {
  const adminId = req.adminId;

  const { courseId } = req.params;

  try {
    const course = await Course.findOneAndDelete({
      _id: courseId,
      creatorId: adminId,
    });

    if (!course) {
      return res
        .status(404)
        .json({ errors: "Can't delete , created by other admin." });
    }
    // Delete image from cloudinary
    // await cloudinary.uploader.destroy(course.image.public_id);
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.log("error in course deleting ", error);
    res.status(500).json({ errors: "Error deleting course" });
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    if (courses.length === 0) {
      return res.status(404).json({ errors: "No courses found" });
    }
    // Wrap in 'course' property to match frontend
    res.status(200).json({
      success: true,
      course: courses, // ← Frontend looks for response.data.course
    });
  } catch (error) {
    console.log("error in getting courses ", error);
    res.status(500).json({ errors: "Error fetching courses" });
  }
};

export const courseDetails = async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }
    res.status(200).json({ course });
  } catch (error) {
    console.log("error in getting course details ", error);
    res.status(500).json({ errors: "Error fetching course details" });
  }
};

const stripe = new Stripe(config.STRIPE_SECRET_KEY);
console.log("secret key:", config.STRIPE_SECRET_KEY);

export const buyCourses = async (req, res) => {
  const { userId } = req;
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }
    const existingPurchase = await Purchase.findOne({ userId, courseId });
    if (existingPurchase) {
      return res
        .status(400)
        .json({ errors: "You have already purchased this course" });
    }

    //stripe payment gateway code
    const amount = course.price;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    // const newPurchase = new Purchase({
    //   userId,
    //   courseId,
    // });
    // newPurchase.save();
    res.status(200).json({
      message: "Course purchased successfully",
      course,
      clientSecret: paymentIntent.client_secret,
      // newPurchase,
    });
  } catch (error) {
    console.log("error in buying course ", error);
    res.status(500).json({ errors: "Error buying course" });
  }
};
