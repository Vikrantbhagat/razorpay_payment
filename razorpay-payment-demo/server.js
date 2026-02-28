require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api", paymentRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});