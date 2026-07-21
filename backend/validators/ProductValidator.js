const { body } = require("express-validator");

const productValidationRules = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required"),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required"),

    body("price")
        .notEmpty()
        .withMessage("Price is required")
        .isFloat({ gt: 0 })
        .withMessage("Price must be greater than 0"),

    body("stock")
        .notEmpty()
        .withMessage("Stock is required")
        .isInt({ min: 0 })
        .withMessage("Stock cannot be negative"),

    body("vendor_id")
        .notEmpty()
        .withMessage("Vendor ID is required")
        .isInt({ min: 1 })
        .withMessage("Vendor ID must be a valid integer"),
];

module.exports = productValidationRules;