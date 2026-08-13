const PurchaseOrder = require("../models/PurchaseOrder");
const Notification = require("../models/Notification");
const AppError = require("../utils/AppError");

// Create Purchase Order
const createPurchaseOrder = async (purchaseOrderData) => {
    const { vendor_id, items } = purchaseOrderData;

    const order = await PurchaseOrder.createPurchaseOrder(
        vendor_id,
        items
    );

    return {
        orderId: order.purchaseOrderId,
        totalAmount: order.totalAmount,
        status: order.status,
    };
};

// Get All Purchase Orders
const getAllPurchaseOrders = async () => {
    return await PurchaseOrder.getAllPurchaseOrders();
};

// Get Purchase Order By ID
const getPurchaseOrderById = async (id) => {
    const order = await PurchaseOrder.getPurchaseOrderById(id);

    if (order.length === 0) {
        throw new AppError(
            "Purchase Order not found",
            404
        );
    }

    return order;
};

// Update Purchase Order Status
const updatePurchaseOrderStatus = async (id, status) => {

    await PurchaseOrder.updatePurchaseOrderStatus(
        id,
        status
    );

    await Notification.createNotificationIfNotExists(
        "Purchase Order Updated",
        `Purchase Order #${id} has been ${status}.`,
        "Purchase Update"
    );

    return;
};

module.exports = {
    createPurchaseOrder,
    getAllPurchaseOrders,
    getPurchaseOrderById,
    updatePurchaseOrderStatus,
};