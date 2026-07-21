const express = require("express");
const router = express.Router();

const VendorController = require("../controllers/VendorController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Create Vendor
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin", "manager"),
    VendorController.addVendor
);

// Get All Vendors
router.get(
    "/",
    authMiddleware,
    authorizeRoles("admin", "manager", "employee"),
    VendorController.getVendors
);

// Update Vendor
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin", "manager"),
    VendorController.updateVendor
);

// Delete Vendor
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    VendorController.deleteVendor
);

module.exports = router;