const express = require("express");
const router = express.Router();

const {
    createInvoice,
    getAllInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice,
} = require("../controllers/invoiceController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Create Invoice
router.post(
    "/",
    authMiddleware,
    upload.single("invoice"),
    createInvoice
);

// Get All Invoices
router.get("/", authMiddleware, getAllInvoices);

// Get Invoice By ID
router.get("/:id", authMiddleware, getInvoiceById);

// Update Invoice
router.put(
    "/:id",
    authMiddleware,
    upload.single("invoice"),
    updateInvoice
);

// Delete Invoice
router.delete("/:id", authMiddleware, deleteInvoice);

module.exports = router;