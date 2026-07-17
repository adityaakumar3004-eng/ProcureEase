const PurchaseOrder = require("../models/PurchaseOrder");

// Create Purchase Order
const createPurchaseOrder = async (req, res) => {
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
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get All Purchase Orders
const getAllPurchaseOrders = async (req, res) => {
    try {
        const orders = await PurchaseOrder.getAllPurchaseOrders();

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Get Purchase Order By ID
const getPurchaseOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await PurchaseOrder.getPurchaseOrderById(id);

        if (order.length === 0) {
            return res.status(404).json({
                message: "Purchase Order not found",
            });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Update Purchase Order Status
const updatePurchaseOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await PurchaseOrder.updatePurchaseOrderStatus(
            id,
            status
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Purchase Order not found",
            });
        }

        res.status(200).json({
            message: "Purchase Order status updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    createPurchaseOrder,
    getAllPurchaseOrders,
    getPurchaseOrderById,
    updatePurchaseOrderStatus,
};