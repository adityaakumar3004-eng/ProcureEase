const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/AuthRoutes");
const vendorRoutes = require("./routes/VendorRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//Auth Routes
app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Welcome to ProcureEase Backend 🚀");
});

module.exports = app;