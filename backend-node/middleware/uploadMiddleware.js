const multer = require("multer");
const path = require("path");

// Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "productImage") {
            cb(null, "uploads/products");
        } else if (file.fieldname === "invoice") {
            cb(null, "uploads/invoices");
        }
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9);

        cb(
            null,
            uniqueName + path.extname(file.originalname)
        );
    },
});

// File filter
const fileFilter = (req, file, cb) => {
    if (file.fieldname === "productImage") {
        const allowedTypes = /jpeg|jpg|png|webp/;

        const extName = allowedTypes.test(
            path.extname(file.originalname).toLowerCase()
        );

        const mimeType = allowedTypes.test(file.mimetype);

        if (extName && mimeType) {
            return cb(null, true);
        }

        return cb(new Error("Only image files are allowed."));
    }

    if (file.fieldname === "invoice") {
        if (file.mimetype === "application/pdf") {
            return cb(null, true);
        }

        return cb(new Error("Only PDF files are allowed."));
    }
    return cb(new Error("Invalid upload field."));
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

module.exports = upload;