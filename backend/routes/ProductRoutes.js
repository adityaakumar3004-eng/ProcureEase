const express = require("express");
const router = express.Router();

const {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
} = require("../controllers/ProductController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const productValidationRules = require("../validators/ProductValidator");
const validateRequest = require("../middleware/validateRequest");

const upload = require("../middleware/uploadMiddleware");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product Management APIs
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - stock
 *               - vendor_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: Gaming Mouse
 *               description:
 *                 type: string
 *                 example: Wireless Gaming Mouse
 *               price:
 *                 type: number
 *                 example: 1200
 *               stock:
 *                 type: integer
 *                 example: 20
 *               vendor_id:
 *                 type: integer
 *                 example: 1
 *               productImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 */
// Create Product
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin", "manager"),
    upload.single("productImage"),
    productValidationRules,
    validateRequest,
    createProduct
);

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search products by name
 *
 *       - in: query
 *         name: vendor_id
 *         schema:
 *           type: integer
 *         description: Filter by vendor ID
 *
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum product price
 *
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum product price
 *
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum:
 *             - name
 *             - price
 *             - stock
 *         description: Field used for sorting
 *
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum:
 *             - ASC
 *             - DESC
 *         description: Sorting order
 *
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page
 *
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *       401:
 *         description: Unauthorized
 */
// Get All Products
router.get(
    "/",
    authMiddleware,
    authorizeRoles("admin", "manager", "employee"),
    getAllProducts
);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Gaming Mouse
 *               description:
 *                 type: string
 *                 example: Updated Wireless Gaming Mouse
 *               price:
 *                 type: number
 *                 example: 1500
 *               stock:
 *                 type: integer
 *                 example: 15
 *               vendor_id:
 *                 type: integer
 *                 example: 1
 *
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
// Update Product
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin", "manager"),
    productValidationRules,
    validateRequest,
    updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
// Delete Product
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    deleteProduct
);

module.exports = router;