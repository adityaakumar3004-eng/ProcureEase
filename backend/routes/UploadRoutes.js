const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

const {
    uploadProductImage,
    uploadInvoice,
} = require("../controllers/uploadController");

const authMiddleware = require("../middleware/authMiddleware");

// Upload Product Image
router.post(
    "/product-image",
    authMiddleware,
    upload.single("productImage"),
    uploadProductImage
);

// Upload Invoice
router.post(
    "/invoice",
    authMiddleware,
    upload.single("invoice"),
    uploadInvoice
);

module.exports = router;