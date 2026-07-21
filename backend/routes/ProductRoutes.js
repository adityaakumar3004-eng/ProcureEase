const express = require("express");
const router = express.Router();

const {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Create Product
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin", "manager"),
    createProduct
);

// Get All Products
router.get(
    "/",
    authMiddleware,
    authorizeRoles("admin", "manager", "employee"),
    getAllProducts
);

// Update Product
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin", "manager"),
    updateProduct
);

// Delete Product
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteProduct
);

module.exports = router;