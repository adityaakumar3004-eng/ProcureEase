const PurchaseOrderService = require("../services/PurchaseOrderService");

// Create Purchase Order
const createPurchaseOrder = async (req, res, next) => {
    try {

        const result =
            await PurchaseOrderService.createPurchaseOrder(req.body);

        res.status(201).json({
            success: true,
            message: "Purchase Order created successfully",
            data: result,
        });

    } catch (error) {
        next(error);
    }
};

// Get All Purchase Orders
const getAllPurchaseOrders = async (req, res, next) => {
    try {

        const orders =
            await PurchaseOrderService.getAllPurchaseOrders();

        res.status(200).json({
            success: true,
            data: orders,
        });

    } catch (error) {
        next(error);
    }
};

// Get Purchase Order By ID
const getPurchaseOrderById = async (req, res, next) => {
    try {

        const { id } = req.params;

        const order =
            await PurchaseOrderService.getPurchaseOrderById(id);

        res.status(200).json({
            success: true,
            data: order,
        });

    } catch (error) {
        next(error);
    }
};

// Update Purchase Order Status
const updatePurchaseOrderStatus = async (req, res, next) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        await PurchaseOrderService.updatePurchaseOrderStatus(
            id,
            status
        );

        res.status(200).json({
            success: true,
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