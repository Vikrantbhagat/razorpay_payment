import React, { useState } from "react";
import axios from "axios";

function App() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const price = 500;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    setMessage("");

    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load.");
      setLoading(false);
      return;
    }

    try {
      const orderResponse = await axios.post(
        "http://localhost:5000/api/create-order",
        {
          productId: 1,
          quantity,
          userId: 1,
        }
      );

      const { order_id, amount, currency } = orderResponse.data;

      const options = {
        key: "rzp_test_SLWaBdY2EeblPp",
        amount,
        currency,
        name: "Vikrant Store",
        description: "Secure Payment",
        order_id,

        handler: async function (response) {
          const verifyResponse = await axios.post(
            "http://localhost:5000/api/verify-payment",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }
          );

          setMessage(verifyResponse.data.message);
        },

        theme: { color: "#6366f1" },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error(error);
      setMessage("Payment failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Secure Payment</h1>
        <p style={styles.subtitle}>Complete your purchase safely</p>

        <div style={styles.planBox}>
          <h2 style={styles.planTitle}>Premium Plan</h2>
          <p style={styles.planPrice}>₹{price}</p>
        </div>

        <div style={styles.quantityWrapper}>
          <label style={{ fontWeight: "500" }}>Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            style={styles.input}
          />
        </div>

        <div style={styles.totalBox}>
          Total Amount
          <div style={styles.totalAmount}>₹{price * quantity}</div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          style={{
            ...styles.button,
            backgroundColor: loading ? "#999" : "#6366f1",
          }}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </div>

      {/* SUCCESS MODAL */}
      {message && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2 style={{ marginBottom: "15px" }}>Payment Status</h2>
            <p style={{ marginBottom: "20px" }}>{message}</p>
            <button
              style={styles.modalButton}
              onClick={() => setMessage("")}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(15px)",
    borderRadius: "25px",
    padding: "40px",
    color: "#fff",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
  },

  title: {
    fontSize: "30px",
    fontWeight: "600",
    marginBottom: "10px",
  },

  subtitle: {
    fontSize: "14px",
    opacity: 0.8,
    marginBottom: "30px",
  },

  planBox: {
    marginBottom: "20px",
  },

  planTitle: {
    fontSize: "18px",
    fontWeight: "500",
  },

  planPrice: {
    fontSize: "24px",
    fontWeight: "700",
    marginTop: "5px",
  },

  quantityWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
  },

  input: {
    width: "70px",
    padding: "8px",
    borderRadius: "8px",
    border: "none",
    textAlign: "center",
    fontSize: "16px",
  },

  totalBox: {
    marginBottom: "25px",
    fontSize: "14px",
    opacity: 0.9,
  },

  totalAmount: {
    fontSize: "22px",
    fontWeight: "700",
    marginTop: "5px",
  },

  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.3s ease",
  },

  /* MODAL */
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "#fff",
    color: "#333",
    padding: "30px",
    borderRadius: "15px",
    textAlign: "center",
    width: "90%",
    maxWidth: "350px",
  },

  modalButton: {
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#6366f1",
    color: "#fff",
    cursor: "pointer",
  },
};

export default App;