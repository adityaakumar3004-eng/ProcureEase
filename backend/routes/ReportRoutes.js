const express = require("express");
const router = express.Router();

const {
    getSalesReport,
    getPurchaseReport,
    getInventoryReport,
    getVendorReport,
} = require("../controllers/ReportController");

const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Reports
 *   description: Report Generation APIs
 */

/**
 * @swagger
 * /api/reports/sales:
 *   get:
 *     summary: Get sales report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales report fetched successfully
 *       401:
 *         description: Unauthorized
 */
// Sales Report
router.get("/sales", authMiddleware, getSalesReport);

/**
 * @swagger
 * /api/reports/purchases:
 *   get:
 *     summary: Get purchase report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Purchase report fetched successfully
 *       401:
 *         description: Unauthorized
 */
// Purchase Report
router.get("/purchases", authMiddleware, getPurchaseReport);

/**
 * @swagger
 * /api/reports/inventory:
 *   get:
 *     summary: Get inventory report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventory report fetched successfully
 *       401:
 *         description: Unauthorized
 */
// Inventory Report
router.get("/inventory", authMiddleware, getInventoryReport);

/**
 * @swagger
 * /api/reports/vendors:
 *   get:
 *     summary: Get vendor report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vendor report fetched successfully
 *       401:
 *         description: Unauthorized
 */
// Vendor Report
router.get("/vendors", authMiddleware, getVendorReport);

module.exports = router;