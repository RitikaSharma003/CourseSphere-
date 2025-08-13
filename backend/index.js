import express from "express";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

import mongoose from "mongoose";
import courseRoute from "./routes/course.route.js";
import fileUpload from "express-fileupload";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import orderRoute from "./routes/order.route.js";
const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

const allowedOrigins = process.env.FRONTEND_URL;

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Handle preflight requests
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.status(204).end();
});
const port = process.env.PORT || 4500;
const DB_URI = process.env.MONGO_URI;
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

try {
  await mongoose.connect(DB_URI);
  console.log("connected to MongoDB");
} catch (error) {
  console.log(error);
}

app.use("/api/v1/course", courseRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/order", orderRoute);
//cloudinary configuration code

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
});

app.listen(port, () => {
  console.log(`example app listening on port ${port}`);
});
