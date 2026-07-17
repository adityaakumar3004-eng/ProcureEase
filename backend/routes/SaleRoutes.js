const express = require("express");
const router = express.Router();

const {
    createSale,
    getAllSales,
} = require("../controllers/saleController");

const authMiddleware = require("../middleware/authMiddleware");

// Create Sale
router.post("/", authMiddleware, createSale);

// Get All Sales
router.get("/", authMiddleware, getAllSales);

module.exports = router;