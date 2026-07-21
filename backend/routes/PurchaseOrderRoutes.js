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
const authorizeRoles = require("../middleware/roleMiddleware");

// Create Purchase Order
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin", "manager"),
    createPurchaseOrder
);

// Get All Purchase Orders
router.get(
    "/",
    authMiddleware,
    authorizeRoles("admin", "manager", "employee"),
    getAllPurchaseOrders
);

// Get Purchase Order By ID
router.get(
    "/:id",
    authMiddleware,
    authorizeRoles("admin", "manager", "employee"),
    getPurchaseOrderById
);

// Update Purchase Order Status
router.put(
    "/:id/status",
    authMiddleware,
    authorizeRoles("admin", "manager"),
    updatePurchaseOrderStatus
);

module.exports = router;