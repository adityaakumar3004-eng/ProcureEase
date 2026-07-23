const Notification = require("../models/Notification");
const Product = require("../models/Product");
const Invoice = require("../models/Invoice");
const AppError = require("../utils/AppError");

// Low stock threshold
const LOW_STOCK_LIMIT = 10;

// Generate Low Stock Notifications
const generateLowStockNotifications = async (req, res, next) => {
    try {
        const products = await Product.getAllProducts();

        let notificationsCreated = 0;

        for (const product of products) {
            if (product.stock <= LOW_STOCK_LIMIT) {

                const title = "Low Stock Alert";
                const message = `${product.name} stock is low (${product.stock} left).`;

                const existingNotification =
                    await Notification.checkExistingNotification(
                        title,
                        message,
                        "Low Stock"
                    );

                if (!existingNotification) {
                    await Notification.createNotification(
                        title,
                        message,
                        "Low Stock"
                    );

                    notificationsCreated++;
                }
            }
        }

        res.status(201).json({
            success: true,
            message: `${notificationsCreated} low stock notification(s) created.`,
        });
    } catch (error) {
        next(error);
    }
};

// Generate Payment Due Notifications
const generatePaymentDueNotifications = async (req, res, next) => {
    try {
        const invoices = await Invoice.getAllInvoices();

        let notificationsCreated = 0;

        const today = new Date();

        for (const invoice of invoices) {
            if (
                invoice.payment_status !== "Paid" 
            ) {

                const title = "Payment Due";
                const message = `Invoice ${invoice.invoice_number} payment is pending.`;

                const existingNotification =
                    await Notification.checkExistingNotification(
                        title,
                        message,
                        "Payment Due"
                    );

                if (!existingNotification) {
                    await Notification.createNotification(
                        title,
                        message,
                        "Payment Due"
                    );

                    notificationsCreated++;
                }
            }
        }

        res.status(201).json({
            success: true,
            message: `${notificationsCreated} payment due notification(s) created.`,
        });
    } catch (error) {
        next(error);
    }
};

// Purchase Update Notification
const createPurchaseUpdateNotification = async (req, res, next) => {
    try {
        const { purchase_order_id, status } = req.body;

        await Notification.createNotification(
            "Purchase Order Updated",
            `Purchase Order #${purchase_order_id} has been ${status}.`,
            "Purchase Update"
        );

        res.status(201).json({
            success: true,
            message: "Purchase update notification created successfully.",
        });
    } catch (error) {
        next(error);
    }
};

// Get All Notifications
const getAllNotifications = async (req, res, next) => {
    try {
        const notifications = await Notification.getAllNotifications();

        res.status(200).json({
            success: true,
            count: notifications.length,
            data: notifications,
        });
    } catch (error) {
        next(error);
    }
};

// Mark Notification as Read
const markNotificationAsRead = async (req, res, next) => {
    try {
        const result = await Notification.markNotificationAsRead(req.params.id);

        if (result.affectedRows === 0) {
            return next(new AppError("Notification not found.", 404));
        }

        res.status(200).json({
            success: true,
            message: "Notification marked as read.",
        });
    } catch (error) {
        next(error);
    }
};

// Delete Notification
const deleteNotification = async (req, res, next) => {
    try {
        const result = await Notification.deleteNotification(req.params.id);

        if (result.affectedRows === 0) {
            return next(new AppError("Notification not found.", 404));
        }

        res.status(200).json({
            success: true,
            message: "Notification deleted successfully.",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    generateLowStockNotifications,
    generatePaymentDueNotifications,
    createPurchaseUpdateNotification,
    getAllNotifications,
    markNotificationAsRead,
    deleteNotification,
};