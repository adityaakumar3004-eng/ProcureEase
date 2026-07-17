const express = require("express");

const router = express.Router();

router.get("/test", (req, res) => {
    res.json({
        message: "Purchase Order Route Working"
    });
});

const {
    createPurchaseOrder,
    getAllPurchaseOrders,
    getPurchaseOrderById,
    updatePurchaseOrderStatus,
} = require("../controllers/PurchaseOrderController");

const authMiddleware = require("../middleware/authMiddleware");

// Create Purchase Order
router.post("/", authMiddleware, createPurchaseOrder);

// Get All Purchase Orders
router.get("/", authMiddleware, getAllPurchaseOrders);

// Get Purchase Order By ID
router.get("/:id", authMiddleware, getPurchaseOrderById);

// Update Purchase Order Status
router.put("/:id/status", authMiddleware, updatePurchaseOrderStatus);

module.exports = router;