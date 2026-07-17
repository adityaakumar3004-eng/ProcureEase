const express = require("express");
const router = express.Router();

const {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");

// Create Product
router.post("/", authMiddleware, createProduct);

// Get All Products
router.get("/", authMiddleware, getAllProducts);

// Update Product
router.put("/:id", authMiddleware, updateProduct);

// Delete Product
router.delete("/:id", authMiddleware, deleteProduct);

module.exports = router;