const express = require("express");
const router = express.Router();

const DashboardController = require("../controllers/DashboardController");
const verifyToken = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Dashboard Analytics APIs
 */

/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Get dashboard summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", verifyToken, DashboardController.getDashboard);

/**
 * @swagger
 * /api/dashboard/monthly-sales:
 *   get:
 *     summary: Get monthly sales chart data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly sales data fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/monthly-sales",
    verifyToken,
    DashboardController.getMonthlySales
);

/**
 * @swagger
 * /api/dashboard/purchase-trends:
 *   get:
 *     summary: Get purchase trends
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Purchase trends fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/purchase-trends",
    verifyToken,
    DashboardController.getPurchaseTrends
);

/**
 * @swagger
 * /api/dashboard/top-products:
 *   get:
 *     summary: Get top-selling products
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top products fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/top-products",
    verifyToken,
    DashboardController.getTopProducts
);

/**
 * @swagger
 * /api/dashboard/inventory-distribution:
 *   get:
 *     summary: Get inventory distribution
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventory distribution fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get(
    "/inventory-distribution",
    verifyToken,
    DashboardController.getInventoryDistribution
);

module.exports = router;