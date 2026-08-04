const { body } = require("express-validator");

const invoiceValidationRules = [

    body("purchase_order_id")
        .notEmpty()
        .withMessage("Purchase Order is required")
        .isInt({ min: 1 })
        .withMessage("Purchase Order ID must be a positive integer"),

    body("invoice_number")
        .trim()
        .notEmpty()
        .withMessage("Invoice number is required"),

    body("invoice_date")
        .notEmpty()
        .withMessage("Invoice date is required")
        .isISO8601()
        .withMessage("Invoice date must be a valid date"),

    body("status")
        .optional()
        .isIn([
            "Pending",
            "Approved",
            "Paid",
            "Rejected",
        ])
        .withMessage(
            "Status must be Pending, Approved, Paid or Rejected"
        ),
];

module.exports = invoiceValidationRules;