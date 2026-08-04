const express = require("express");
const router = express.Router();

const {
    getAllPayments,
} = require("../controllers/PaymentController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment History APIs
 */

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Get all payment records
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment records fetched successfully
 *       401:
 *         description: Unauthorized
 */

// Get All Payments
router.get(
    "/",
    authMiddleware,
    authorizeRoles("admin", "manager", "employee"),
    getAllPayments
);

module.exports = router;