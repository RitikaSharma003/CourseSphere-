import dotenv from "dotenv";
dotenv.config();

const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD;
const STRIPE_SECRET_KEY =
  "sk_test_51RtmnT1UCCYiRsGPtwkzPQMLAkWS98wAgOFB3XaFRjad49TuDz9Xzsaq8s7AlSLrHojgSGqT1dIMooLgIUq2JmnD00jG0IH7YK";

export default {
  JWT_USER_PASSWORD,
  JWT_ADMIN_PASSWORD,
  STRIPE_SECRET_KEY,
};
