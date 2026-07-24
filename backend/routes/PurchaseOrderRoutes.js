const express = require("express");
const router = express.Router();

const {
    createPurchaseOrder,
    getAllPurchaseOrders,
    getPurchaseOrderById,
    updatePurchaseOrderStatus,
} = require("../controllers/PurchaseOrderController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

/**
 * @swagger
 * tags:
 *   name: Purchase Orders
 *   description: Purchase Order Management APIs
 */

/**
 * @swagger
 * /api/purchase-orders:
 *   post:
 *     summary: Create a new purchase order
 *     tags: [Purchase Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vendor_id
 *               - product_id
 *               - quantity
 *             properties:
 *               vendor_id:
 *                 type: integer
 *                 example: 1
 *               product_id:
 *                 type: integer
 *                 example: 5
 *               quantity:
 *                 type: integer
 *                 example: 20
 *     responses:
 *       201:
 *         description: Purchase Order created successfully
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */
// Create Purchase Order
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin", "manager"),
    createPurchaseOrder
);

/**
 * @swagger
 * /api/purchase-orders:
 *   get:
 *     summary: Get all purchase orders
 *     tags: [Purchase Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Purchase Orders fetched successfully
 *       401:
 *         description: Unauthorized
 */
// Get All Purchase Orders
router.get(
    "/",
    authMiddleware,
    authorizeRoles("admin", "manager", "employee"),
    getAllPurchaseOrders
);

/**
 * @swagger
 * /api/purchase-orders/{id}:
 *   get:
 *     summary: Get purchase order by ID
 *     tags: [Purchase Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Purchase Order ID
 *     responses:
 *       200:
 *         description: Purchase Order fetched successfully
 *       404:
 *         description: Purchase Order not found
 */
// Get Purchase Order By ID
router.get(
    "/:id",
    authMiddleware,
    authorizeRoles("admin", "manager", "employee"),
    getPurchaseOrderById
);

/**
 * @swagger
 * /api/purchase-orders/{id}/status:
 *   put:
 *     summary: Update purchase order status
 *     tags: [Purchase Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Purchase Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 example: Approved
 *     responses:
 *       200:
 *         description: Purchase Order status updated successfully
 *       404:
 *         description: Purchase Order not found
 */
// Update Purchase Order Status
router.put(
    "/:id/status",
    authMiddleware,
    authorizeRoles("admin", "manager"),
    updatePurchaseOrderStatus
);

module.exports = router;