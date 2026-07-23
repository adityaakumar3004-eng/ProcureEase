const express = require("express");
const router = express.Router();

const DashboardController = require("../controllers/DashboardController");
const verifyToken = require("../middleware/authMiddleware");

// Dashboard Summary
router.get("/", verifyToken, DashboardController.getDashboard);

// Monthly Sales
router.get(
    "/monthly-sales",
    verifyToken,
    DashboardController.getMonthlySales
);

// Purchase Trends
router.get(
    "/purchase-trends",
    verifyToken,
    DashboardController.getPurchaseTrends
);

// Top Products
router.get(
    "/top-products",
    verifyToken,
    DashboardController.getTopProducts
);

// Inventory Distribution
router.get(
    "/inventory-distribution",
    verifyToken,
    DashboardController.getInventoryDistribution
);

module.exports = router;