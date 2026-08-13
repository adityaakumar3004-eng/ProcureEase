const { body } = require("express-validator");

const vendorValidationRules = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Vendor name is required"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email"),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required")
        .isLength({ min: 10, max: 10 })
        .withMessage("Phone number must be exactly 10 digits")
        .isNumeric()
        .withMessage("Phone number must contain only digits"),

    body("address")
        .trim()
        .notEmpty()
        .withMessage("Address is required"),
];

module.exports = vendorValidationRules;