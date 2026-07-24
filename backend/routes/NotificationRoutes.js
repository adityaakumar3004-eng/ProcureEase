const express = require("express");
const router = express.Router();

const {
    generateLowStockNotifications,
    generatePaymentDueNotifications,
    getAllNotifications,
    markNotificationAsRead,
    deleteNotification,
} = require("../controllers/notificationController");

const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification Management APIs
 */

/**
 * @swagger
 * /api/notifications/low-stock:
 *   post:
 *     summary: Generate low stock notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Low stock notifications generated successfully
 *       401:
 *         description: Unauthorized
 */
// Generate Low Stock Notifications
router.post(
    "/low-stock",
    authMiddleware,
    generateLowStockNotifications
);

/**
 * @swagger
 * /api/notifications/payment-due:
 *   post:
 *     summary: Generate payment due notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment due notifications generated successfully
 *       401:
 *         description: Unauthorized
 */
// Generate Payment Due Notifications
router.post(
    "/payment-due",
    authMiddleware,
    generatePaymentDueNotifications
);

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Get all notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications fetched successfully
 *       401:
 *         description: Unauthorized
 */
// Get All Notifications
router.get(
    "/",
    authMiddleware,
    getAllNotifications
);

/**
 * @swagger
 * /api/notifications/{id}/read:
 *   put:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       404:
 *         description: Notification not found
 */
// Mark Notification as Read
router.put(
    "/:id/read",
    authMiddleware,
    markNotificationAsRead
);

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     summary: Delete notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found
 */
// Delete Notification
router.delete(
    "/:id",
    authMiddleware,
    deleteNotification
);

module.exports = router;