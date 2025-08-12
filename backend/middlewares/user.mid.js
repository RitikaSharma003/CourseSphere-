import jwt from "jsonwebtoken";
import config from "../config.js";
function userMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  console.log("Authorization header in middleware:", authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  console.log("Token received in middleware:", token);

  try {
    const decoded = jwt.verify(token, config.JWT_USER_PASSWORD);
    console.log("Decoded token:", decoded);
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.error("Invalid Token or Expired ", error);
    return res.status(401).json({ errors: "Invalid token or expired" });
  }
}
export default userMiddleware;
