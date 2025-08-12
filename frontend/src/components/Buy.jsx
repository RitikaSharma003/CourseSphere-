import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import "./Buy.css";

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../utils/utils";
function Buy() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({});

  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  console.log(token);

  const stripe = useStripe();
  const elements = useElements();
  const [cardError, setCardError] = useState("");

  useEffect(() => {
    if (!token) {
      toast.error("Please log in to purchase this course.");
      navigate("/login");
      return;
    }
    const fetchBuyCourseData = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/course/${courseId}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",

              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log("Backend  Response:", response.data);
        console.log("Course data:", response.data.course);
        setCourse(response.data.course);
        const purchasesResponse = await axios.get(
          `${BACKEND_URL}/user/purchases`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        // 3. Check if current course is in purchases
        const alreadyPurchased = purchasesResponse.data.courseData.some(
          (purchase) => purchase._id === courseId
        );

        if (alreadyPurchased) {
          toast.error("You have already purchased this course");
          navigate("/purchases");
        }
      } catch (error) {
        toast.error(error?.response?.data?.errors || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchBuyCourseData();
  }, [courseId, token, navigate]);

  const handlePurchase = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log("Stripe or Element not found");
      return;
    }

    setLoading(true);
    const card = elements.getElement(CardElement);

    if (card == null) {
      console.log("Cardelement not found");
      setLoading(false);
      return;
    }

    try {
      // First create payment intent (this is when purchase actually happens)
      const paymentResponse = await axios.post(
        `${BACKEND_URL}/course/buy/${courseId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      const { clientSecret } = paymentResponse.data;

      // Use your card Element with other Stripe.js APIs
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card,
      });

      if (error) {
        console.log("Stripe PaymentMethod Error: ", error);
        setLoading(false);
        setCardError(error.message);
      } else {
        console.log("[PaymentMethod Created]", paymentMethod);
      }
      if (!clientSecret) {
        console.log("No client secret found");
        setLoading(false);
        return;
      }
      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: card,
            billing_details: {
              name: user?.user?.firstName,
              email: user?.user?.email,
            },
          },
        });
      if (confirmError) {
        setCardError(confirmError.message);
      } else if (paymentIntent.status === "succeeded") {
        console.log("Payment succeeded: ", paymentIntent);
        setCardError("your payment id: ", paymentIntent.id);
        const paymentInfo = {
          email: user?.user?.email,
          userId: user.user._id,
          courseId: courseId,
          paymentId: paymentIntent.id,
          amount: paymentIntent.amount,
          status: paymentIntent.status,
        };
        console.log("Payment info: ", paymentInfo);
        await axios
          .post(`${BACKEND_URL}/order/`, paymentInfo, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          })
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
            toast.error("Error in making payment");
          });
        toast.success("Payment Successful");
        navigate("/purchases");
      }
    } catch (error) {
      if (error?.response?.status === 400) {
        toast.error("You have already purchased this course");
        navigate("/purchases");
      } else {
        toast.error(error?.response?.data?.errors || "Payment failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error ? (
        <div className="error-container">
          <div className="error-message">
            <p className="error-text">{error}</p>
            <Link className="error-link" to={"/purchases"}>
              Purchases
            </Link>
          </div>
        </div>
      ) : (
        <div className="payment-container">
          <div className="order-details">
            <h1 className="order-title">Order Details</h1>
            <div className="price-container">
              <h1 className="price-label">Total Price:</h1>
              <p className="price-value">${course?.price || "N/A"}</p>
            </div>
            <div className="course-container">
              <h1 className="course-label">Course name:</h1>
              <p className="course-value">{course?.title || "N/A"}</p>
            </div>
          </div>
          <div className="payment-form-container">
            <div className="payment-card">
              <h2 className="payment-title">Process your Payment!</h2>
              <div className="card-element-container">
                <label className="card-label" htmlFor="card-number">
                  Credit/Debit Card
                </label>
                <form onSubmit={handlePurchase} className="payment-form">
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: "16px",
                          color: "#2a3379ff",
                          "::placeholder": {
                            color: "#628bb5ff",
                          },
                        },
                        invalid: {
                          color: "#9e2146",
                        },
                      },
                    }}
                  />

                  <button
                    type="submit"
                    disabled={!stripe || loading}
                    className={`payment-button ${loading ? "processing" : ""}`}
                  >
                    {loading ? "Processing..." : "Pay"}
                  </button>
                </form>
                {cardError && <p className="card-error">{cardError}</p>}
              </div>

              <button className="alternative-payment-button">
                <span className="payment-icon">🅿️</span> Other Payments Method
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Buy;
