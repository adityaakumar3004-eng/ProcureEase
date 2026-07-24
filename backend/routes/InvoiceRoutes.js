const express = require("express");
const router = express.Router();

const {
    createInvoice,
    getAllInvoices,
    getInvoiceById,
    updateInvoice,
    markInvoiceAsPaid,
    deleteInvoice,
} = require("../controllers/InvoiceController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Invoice Management APIs
 */

/**
 * @swagger
 * /api/invoices:
 *   post:
 *     summary: Create a new invoice
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - purchase_order_id
 *               - invoice_number
 *               - invoice_date
 *               - invoice
 *             properties:
 *               purchase_order_id:
 *                 type: integer
 *                 example: 1
 *               invoice_number:
 *                 type: string
 *                 example: INV-001
 *               invoice_date:
 *                 type: string
 *                 format: date
 *                 example: 2026-07-24
 *               invoice:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Invoice created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 */
// Create Invoice
router.post(
    "/",
    authMiddleware,
    upload.single("invoice"),
    createInvoice
);

/**
 * @swagger
 * /api/invoices:
 *   get:
 *     summary: Get all invoices
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Invoices fetched successfully
 */
// Get All Invoices
router.get("/", authMiddleware, getAllInvoices);

/**
 * @swagger
 * /api/invoices/{id}:
 *   get:
 *     summary: Get invoice by ID
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Invoice ID
 *     responses:
 *       200:
 *         description: Invoice fetched successfully
 *       404:
 *         description: Invoice not found
 */
// Get Invoice By ID
router.get("/:id", authMiddleware, getInvoiceById);

/**
 * @swagger
 * /api/invoices/{id}:
 *   put:
 *     summary: Update invoice
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Invoice ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               invoice_number:
 *                 type: string
 *                 example: INV-001-UPDATED
 *               invoice_date:
 *                 type: string
 *                 format: date
 *               invoice:
 *                 type: string
 *                 format: binary
 *               status:
 *                 type: string
 *                 example: Pending
 *     responses:
 *       200:
 *         description: Invoice updated successfully
 *       404:
 *         description: Invoice not found
 */
// Update Invoice
router.put(
    "/:id",
    authMiddleware,
    upload.single("invoice"),
    updateInvoice
);

/**
 * @swagger
 * /api/invoices/{id}/pay:
 *   put:
 *     summary: Mark invoice as paid
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Invoice ID
 *     responses:
 *       200:
 *         description: Invoice marked as paid
 *       404:
 *         description: Invoice not found
 */
// Mark Invoice as Paid
router.put("/:id/pay", authMiddleware, markInvoiceAsPaid);

/**
 * @swagger
 * /api/invoices/{id}:
 *   delete:
 *     summary: Delete invoice
 *     tags: [Invoices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Invoice ID
 *     responses:
 *       200:
 *         description: Invoice deleted successfully
 *       404:
 *         description: Invoice not found
 */
// Delete Invoice
router.delete("/:id", authMiddleware, deleteInvoice);

module.exports = router;