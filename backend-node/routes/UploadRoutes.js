const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
    uploadProductImage,
    uploadInvoice,
} = require("../controllers/UploadController");

const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File Upload APIs
 */

/**
 * @swagger
 * /api/upload/product-image:
 *   post:
 *     summary: Upload a product image
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - productImage
 *             properties:
 *               productImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product image uploaded successfully
 *       400:
 *         description: Invalid file
 *       401:
 *         description: Unauthorized
 */
// Upload Product Image
router.post(
    "/product-image",
    authMiddleware,
    upload.single("productImage"),
    uploadProductImage
);

/**
 * @swagger
 * /api/upload/invoice:
 *   post:
 *     summary: Upload an invoice file
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - invoice
 *             properties:
 *               invoice:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Invoice uploaded successfully
 *       400:
 *         description: Invalid file
 *       401:
 *         description: Unauthorized
 */
// Upload Invoice
router.post(
    "/invoice",
    authMiddleware,
    upload.single("invoice"),
    uploadInvoice
);

module.exports = router;