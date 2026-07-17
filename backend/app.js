const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/AuthRoutes");
const vendorRoutes = require("./routes/VendorRoutes");
const productRoutes = require("./routes/ProductRoutes");
const purchaseOrderRoutes = require("./routes/PurchaseOrderRoutes");
const saleRoutes = require("./routes/saleRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//Auth Routes
app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/products", productRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/sales", saleRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Welcome to ProcureEase Backend 🚀");
});

module.exports = app;