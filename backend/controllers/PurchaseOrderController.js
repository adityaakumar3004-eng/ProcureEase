const PurchaseOrder = require("../models/PurchaseOrder");
const Notification = require("../models/Notification");

// Create Purchase Order
const createPurchaseOrder = async (req, res, next) => {
    try {
        const { vendor_id, items } = req.body;

        const order = await PurchaseOrder.createPurchaseOrder(
            vendor_id,
            items
        );

        res.status(201).json({
            message: "Purchase Order created successfully",
            orderId: order.purchaseOrderId,
            totalAmount: order.totalAmount,
            status: order.status,
        });
    }  catch (error) {
        next(error);
    }
};

// Get All Purchase Orders
const getAllPurchaseOrders = async (req, res, next) => {
    try {
        const orders = await PurchaseOrder.getAllPurchaseOrders();

        res.status(200).json(orders);
    }  catch (error) {
        next(error);
    }
};

// Get Purchase Order By ID
const getPurchaseOrderById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const order = await PurchaseOrder.getPurchaseOrderById(id);

        if (order.length === 0) {
            return res.status(404).json({
                message: "Purchase Order not found",
            });
        }

        res.status(200).json(order);
    }  catch (error) {
        next(error);
    }
};

// Update Purchase Order Status
const updatePurchaseOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await PurchaseOrder.updatePurchaseOrderStatus(
            id,
            status
        );
        const title = "Purchase Order Updated";
        const message = `Purchase Order #${id} has been ${status}.`;

       await Notification.createNotificationIfNotExists(
    "Purchase Order Updated",
    `Purchase Order #${id} has been ${status}.`,
    "Purchase Update"
);


        res.status(200).json({
            message: "Purchase Order status updated successfully",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createPurchaseOrder,
    getAllPurchaseOrders,
    getPurchaseOrderById,
    updatePurchaseOrderStatus,
};