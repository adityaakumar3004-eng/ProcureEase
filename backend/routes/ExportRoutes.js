const express = require("express");

const router = express.Router();

const {
    exportProductsCSV,
    exportProductsExcel,
    exportProductsPDF,
} = require("../controllers/exportController");

const authMiddleware = require("../middleware/authMiddleware");

// Export Products as CSV
router.get(
    "/products/csv",
    authMiddleware,
    exportProductsCSV
);

// Export Products as Excel
router.get(
    "/products/excel",
    authMiddleware,
    exportProductsExcel
);

// Export Products as PDF
router.get(
    "/products/pdf",
    authMiddleware,
    exportProductsPDF
);

module.exports = router;