// Upload Product Image
const uploadProductImage = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image uploaded.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Product image uploaded successfully.",
            file: req.file.filename,
            path: req.file.path.replace(/\\/g, "/"),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Upload Invoice
const uploadInvoice = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No invoice uploaded.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Invoice uploaded successfully.",
            file: req.file.filename,
            path: req.file.path.replace(/\\/g, "/"),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    uploadProductImage,
    uploadInvoice,
};