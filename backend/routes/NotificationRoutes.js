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

// Generate Low Stock Notifications
router.post(
    "/low-stock",
    authMiddleware,
    generateLowStockNotifications
);

// Generate Payment Due Notifications
router.post(
    "/payment-due",
    authMiddleware,
    generatePaymentDueNotifications
);

// Get All Notifications
router.get(
    "/",
    authMiddleware,
    getAllNotifications
);

// Mark Notification as Read
router.put(
    "/:id/read",
    authMiddleware,
    markNotificationAsRead
);

// Delete Notification
router.delete(
    "/:id",
    authMiddleware,
    deleteNotification
);

module.exports = router;