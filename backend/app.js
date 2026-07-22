const express = require("express");
const cors = require("cors");
const path = require("path");


const authRoutes = require("./routes/AuthRoutes");
const vendorRoutes = require("./routes/VendorRoutes");
const productRoutes = require("./routes/ProductRoutes");
const purchaseOrderRoutes = require("./routes/PurchaseOrderRoutes");
const saleRoutes = require("./routes/SaleRoutes");
const dashboardRoutes = require("./routes/DashboardRoutes");
const uploadRoutes = require("./routes/UploadRoutes");
const invoiceRoutes = require("./routes/InvoiceRoutes");

const errorHandler = require("./middleware/errorHandler");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//Auth Routes
app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/products", productRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/invoices", invoiceRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Welcome to ProcureEase Backend 🚀");
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;