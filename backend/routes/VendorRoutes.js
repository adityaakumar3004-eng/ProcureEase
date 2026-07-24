const express = require("express");
const router = express.Router();

const VendorController = require("../controllers/VendorController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

/**
 * @swagger
 * tags:
 *   name: Vendors
 *   description: Vendor Management APIs
 */

/**
 * @swagger
 * /api/vendors:
 *   post:
 *     summary: Create a new vendor
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - address
 *             properties:
 *               name:
 *                 type: string
 *                 example: ABC Suppliers
 *               email:
 *                 type: string
 *                 example: abc@gmail.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               address:
 *                 type: string
 *                 example: Delhi, India
 *     responses:
 *       201:
 *         description: Vendor created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
// Create Vendor
router.post(
    "/",
    authMiddleware,
    authorizeRoles("admin", "manager"),
    VendorController.addVendor
);

/**
 * @swagger
 * /api/vendors:
 *   get:
 *     summary: Get all vendors
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vendors
 *       401:
 *         description: Unauthorized
 */
// Get All Vendors
router.get(
    "/",
    authMiddleware,
    authorizeRoles("admin", "manager", "employee"),
    VendorController.getVendors
);

/**
 * @swagger
 * /api/vendors/{id}:
 *   put:
 *     summary: Update vendor
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vendor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Vendor updated successfully
 *       404:
 *         description: Vendor not found
 */
// Update Vendor
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin", "manager"),
    VendorController.updateVendor
);

/**
 * @swagger
 * /api/vendors/{id}:
 *   delete:
 *     summary: Delete vendor
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Vendor ID
 *     responses:
 *       200:
 *         description: Vendor deleted successfully
 *       404:
 *         description: Vendor not found
 */
// Delete Vendor
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    VendorController.deleteVendor
);

module.exports = router;