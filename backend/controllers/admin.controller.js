import { z } from "zod";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import config from "../config.js";

import { Admin } from "../models/admin.model.js";
export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const AdminSchema = z.object({
    firstName: z
      .string()
      .min(3, { message: "firstName must be atleast 3 char long" }),
    lastName: z
      .string()
      .min(3, { message: "lastName must be atleast 3 char long" }),
    email: z.string().email(),
    password: z
      .string()
      .min(6, { message: "password must be atleast 6 char long" }),
  });
  const validatedData = AdminSchema.safeParse(req.body);

  if (!validatedData.success) {
    return res
      .status(400)
      .json({ errors: validatedData.error.issues.map((err) => err.message) });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const existingAdmin = await Admin.findOne({ email: email });
    if (existingAdmin) {
      return res.status(400).json({ error: "Admin already exists" });
    }
    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await newAdmin.save();
    res.status(201).json({ message: "Admin created successfully", newAdmin });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ errors: "Error creating Admin" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email: email });
    const isPasswordCorrect = await bcrypt.compare(password, admin.password);
    if (!admin || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    //jwt code
    const token = jwt.sign(
      {
        id: admin._id,
      },
      config.JWT_ADMIN_PASSWORD,
      { expiresIn: "1d" }
    );
    const cookieOptions = {
      expires: new Date(Date.now() + 24 + 60 * 60 * 1000),
      httpOnly: true, //cannot be accessed by client-side scripts directly
      secure: process.env.NODE_ENV === "production", //true for https only
      sameSite: "Strict", // helps prevent CSRF attacks
    };
    res.cookie("jwt", token, cookieOptions);

    res.status(200).json({ message: "Login successful", admin, token });
  } catch (error) {
    console.log("error in logging ", error);
    return res.status(500).json({ errors: "Error logging in Admin" });
  }
};

export const logout = async (req, res) => {
  try {
    if (!req.cookies.jwt) {
      return res.status(401).json({ errors: "Kindly login first" });
    }
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.log("error in logging out ", error);
    return res.status(500).json({ errors: "Error logging out Admin" });
  }
};
