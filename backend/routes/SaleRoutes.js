const express = require("express");
const router = express.Router();

const {
    createSale,
    getAllSales,
} = require("../controllers/saleController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Create Sale
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin", "manager"),
    createSale
);

// Get All Sales
router.get(
    "/",
    authMiddleware,
    authorizeRoles("admin", "manager", "employee"),
    getAllSales
);

module.exports = router;