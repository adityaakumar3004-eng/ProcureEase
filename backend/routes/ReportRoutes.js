const express = require("express");
const router = express.Router();

const {
    getSalesReport,
    getPurchaseReport,
    getInventoryReport,
    getVendorReport,
} = require("../controllers/reportController");

const authMiddleware = require("../middleware/authMiddleware");

// Sales Report
router.get("/sales", authMiddleware, getSalesReport);

// Purchase Report
router.get("/purchases", authMiddleware, getPurchaseReport);

// Inventory Report
router.get("/inventory", authMiddleware, getInventoryReport);

// Vendor Report
router.get("/vendors", authMiddleware, getVendorReport);

module.exports = router;