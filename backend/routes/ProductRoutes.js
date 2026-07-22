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

const productValidationRules = require("../validators/productValidator");
const validateRequest = require("../middleware/validateRequest");

const upload = require("../middleware/uploadMiddleware");

// Create Product
// Create Product (Temporary Debug Route)
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin", "manager"),
    upload.single("productImage"),
    productValidationRules,
    validateRequest,
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
    productValidationRules,
    validateRequest,
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