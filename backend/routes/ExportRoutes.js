const express = require("express");
const router = express.Router();

const {
    exportProductsCSV,
    exportProductsExcel,
    exportProductsPDF,
} = require("../controllers/ExportController");

const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Export
 *   description: Export Products APIs
 */

/**
 * @swagger
 * /api/export/products/csv:
 *   get:
 *     summary: Export products as CSV
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CSV file downloaded successfully
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 */
// Export Products as CSV
router.get(
    "/products/csv",
    authMiddleware,
    exportProductsCSV
);

/**
 * @swagger
 * /api/export/products/excel:
 *   get:
 *     summary: Export products as Excel
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Excel file downloaded successfully
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 */
// Export Products as Excel
router.get(
    "/products/excel",
    authMiddleware,
    exportProductsExcel
);

/**
 * @swagger
 * /api/export/products/pdf:
 *   get:
 *     summary: Export products as PDF
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: PDF file downloaded successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 */
// Export Products as PDF
router.get(
    "/products/pdf",
    authMiddleware,
    exportProductsPDF
);

module.exports = router;