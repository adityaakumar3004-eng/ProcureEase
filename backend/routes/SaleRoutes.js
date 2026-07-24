const express = require("express");
const router = express.Router();

const {
    createSale,
    getAllSales,
} = require("../controllers/SaleController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Sales Management APIs
 */

/**
 * @swagger
 * /api/sales:
 *   post:
 *     summary: Create a new sale
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - quantity
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Sale created successfully
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */
// Create Sale
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin", "manager"),
    createSale
);

/**
 * @swagger
 * /api/sales:
 *   get:
 *     summary: Get all sales
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sales fetched successfully
 *       401:
 *         description: Unauthorized
 */
// Get All Sales
router.get(
    "/",
    authMiddleware,
    authorizeRoles("admin", "manager", "employee"),
    getAllSales
);

module.exports = router;