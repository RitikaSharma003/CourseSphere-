import React from "react";
import ReactDOM from "react-dom/client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
const stripePromise = loadStripe(
  "pk_test_51RtmnT1UCCYiRsGP1h9xPeytX9aSsHQcSFiHz1Jyd4fF4dDjJ0TklTB4kKwQHKOu9K4tIP90zyEhb5XDH87Ludcc00utrA0fGp"
);
ReactDOM.createRoot(document.getElementById("root")).render(
  <Elements stripe={stripePromise}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Elements>
);
