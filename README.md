# 💳 Razorpay Payment Integration (Full Stack)

A secure and structured Razorpay payment integration using:

- Node.js
- Express.js
- MySQL
- Razorpay Test Mode
- React.js Frontend
- Webhook Integration

---

## 🚀 Project Overview

This project demonstrates a complete Razorpay payment workflow including:

✔ Order Creation  
✔ Payment Verification  
✔ Signature Validation  
✔ Webhook Integration  
✔ Database Storage  
✔ Secure Environment Variables  

It follows production-level payment architecture.

---

## 🛠 Tech Stack

### 🔹 Backend
- Node.js
- Express.js
- MySQL
- Razorpay SDK
- dotenv
- crypto (Signature verification)

### 🔹 Frontend
- React.js (Vite)
- Axios
- Razorpay Checkout.js
- Modern Responsive UI

---

## 🔐 Security Features

- API Keys stored in `.env`
- Signature verification using HMAC SHA256
- Webhook signature validation
- Amount calculated securely on backend
- Duplicate payment prevention
- Proper HTTP status codes
- Error handling

---

## 📦 API Endpoints

### 1️⃣ Create Order

# 💳 Razorpay Payment Integration (Full Stack)

A secure and structured Razorpay payment integration using:

- Node.js
- Express.js
- MySQL
- Razorpay Test Mode
- React.js Frontend
- Webhook Integration

---

## 🚀 Project Overview

This project demonstrates a complete Razorpay payment workflow including:

✔ Order Creation  
✔ Payment Verification  
✔ Signature Validation  
✔ Webhook Integration  
✔ Database Storage  
✔ Secure Environment Variables  

It follows production-level payment architecture.

---

## 🛠 Tech Stack

### 🔹 Backend
- Node.js
- Express.js
- MySQL
- Razorpay SDK
- dotenv
- crypto (Signature verification)

### 🔹 Frontend
- React.js (Vite)
- Axios
- Razorpay Checkout.js
- Modern Responsive UI

---

## 🔐 Security Features

- API Keys stored in `.env`
- Signature verification using HMAC SHA256
- Webhook signature validation
- Amount calculated securely on backend
- Duplicate payment prevention
- Proper HTTP status codes
- Error handling

---

## 🔄 Payment Flow

1. User clicks "Pay Now"
2. Frontend calls `/api/create-order`
3. Backend creates Razorpay order
4. Razorpay Checkout opens
5. After payment:
   - Frontend calls `/api/verify-payment`
   - Razorpay also triggers webhook
6. Database updates payment status

---

## 🧪 Test Mode

Use Razorpay test card:


Card Number: 4111 1111 1111 1111
Expiry: 12/30
CVV: 123
OTP: 123456
