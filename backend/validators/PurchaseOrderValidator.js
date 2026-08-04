const { body } = require("express-validator");

// Create Purchase Order Validation
const createPurchaseOrderValidationRules = [
    body("vendor_id")
        .notEmpty()
        .withMessage("Vendor is required")
        .isInt({ min: 1 })
        .withMessage("Vendor ID must be a positive integer"),

    body("product_id")
        .notEmpty()
        .withMessage("Product is required")
        .isInt({ min: 1 })
        .withMessage("Product ID must be a positive integer"),

    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1"),
];

// Update Purchase Order Status Validation
const updatePurchaseOrderStatusValidationRules = [
    body("status")
        .notEmpty()
        .withMessage("Status is required")
        .isIn([
            "Pending",
            "Approved",
            "Rejected",
            "Completed",
        ])
        .withMessage(
            "Status must be Pending, Approved, Rejected or Completed"
        ),
];

module.exports = {
    createPurchaseOrderValidationRules,
    updatePurchaseOrderStatusValidationRules,
};