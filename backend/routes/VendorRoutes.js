const express = require("express");
const router = express.Router();

const VendorController = require("../controllers/VendorController");
const authMiddleware = require("../middleware/authMiddleware");

// Protected Routes
router.post("/", authMiddleware, VendorController.addVendor);
router.get("/", authMiddleware, VendorController.getVendors);
router.put("/:id", authMiddleware, VendorController.updateVendor);
router.delete("/:id", authMiddleware, VendorController.deleteVendor);

module.exports = router;