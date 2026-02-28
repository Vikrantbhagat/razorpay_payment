const db = require("../config/db");
const razorpay = require("../services/razorpayService");
const crypto = require("crypto");

/* ===========================
   A. CREATE ORDER
=========================== */
exports.createOrder = async (req, res) => {
  try {
    const { productId, quantity = 1, userId = 1 } = req.body;

    const productAmountMap = {
      1: 50000,
      2: 100000,
    };

    const baseAmount = productAmountMap[productId];

    if (!baseAmount) {
      return res.status(400).json({ message: "Invalid product" });
    }

    const amount = baseAmount * quantity;

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    });

    const internalOrderId = crypto.randomUUID();

    await db.execute(
      `INSERT INTO payments 
       (user_id, internal_order_id, razorpay_order_id, amount, currency, payment_status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, internalOrderId, order.id, amount, "INR", "created"]
    );

    res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });

  } catch (error) {
    console.error("Order Creation Error:", error);
    res.status(500).json({
      message: "Order creation failed",
      error: error.message,
    });
  }
};


/* ===========================
   B. VERIFY PAYMENT
=========================== */
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        message: "All payment fields are required",
      });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    const isValid = generatedSignature === razorpay_signature;

    // 🔍 DEBUG: Check if row exists
    const [rows] = await db.execute(
      `SELECT * FROM payments WHERE razorpay_order_id = ?`,
      [razorpay_order_id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Order not found in DB" });
    }

    // ✅ ALWAYS store payment_id & signature
    await db.execute(
      `UPDATE payments
       SET razorpay_payment_id=?, signature=?, payment_status=?
       WHERE razorpay_order_id=?`,
      [
        razorpay_payment_id,
        razorpay_signature,
        isValid ? "paid" : "failed",
        razorpay_order_id,
      ]
    );

    if (!isValid) {
      return res.status(400).json({
        message: "Invalid signature",
      });
    }

    res.status(200).json({
      message: "Payment verified successfully",
    });

  } catch (error) {
    console.error("Verification Error:", error);
    res.status(500).json({
      message: "Verification failed",
      error: error.message,
    });
  }
};


/* ===========================
   C. WEBHOOK
=========================== */
exports.webhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(req.rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).send("Invalid webhook signature");
    }

    const event = req.body.event;
    const paymentEntity = req.body.payload.payment.entity;

    console.log("Webhook Event:", event);
    console.log("Payment Data:", paymentEntity);

    // 🔥 FIX: Always update using ORDER ID
    await db.execute(
      `UPDATE payments
       SET razorpay_payment_id=?, payment_status=?
       WHERE razorpay_order_id=?`,
      [
        paymentEntity.id,
        event === "payment.captured" ? "paid" : "failed",
        paymentEntity.order_id,
      ]
    );

    res.status(200).json({ status: "Webhook processed successfully" });

  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).send("Webhook processing failed");
  }
};