const Invoice = require("../models/Invoice");
const AppError = require("../utils/AppError");
const Notification = require("../models/Notification");

// Create Invoice
const createInvoice = async (req, res, next) => {
    try {
        const {
            purchase_order_id,
            invoice_number,
            invoice_date,
            status,
        } = req.body;

        const invoice_file = req.file ? req.file.filename : null;

        const result = await Invoice.createInvoice(
            purchase_order_id,
            invoice_number,
            invoice_file,
            invoice_date,
            status
        );
        if (status !== "Paid") {
    const title = "Payment Due";
    const message = `Invoice ${invoice_number} payment is pending.`;

await Notification.createNotificationIfNotExists(
    "Payment Due",
    `Invoice ${invoice_number} payment is pending.`,
    "Payment Due"
);
}

        res.status(201).json({
            success: true,
            message: "Invoice created successfully",
            invoiceId: result.insertId,
        });
    } catch (error) {
        next(error);
    }
};

// Get All Invoices
const getAllInvoices = async (req, res, next) => {
    try {
        const invoices = await Invoice.getAllInvoices();

        res.status(200).json({
            success: true,
            count: invoices.length,
            data: invoices,
        });
    } catch (error) {
        next(error);
    }
};

// Get Invoice By ID
const getInvoiceById = async (req, res, next) => {
    try {
        const invoice = await Invoice.getInvoiceById(req.params.id);

        if (!invoice) {
            return next(new AppError("Invoice not found", 404));
        }

        res.status(200).json({
            success: true,
            data: invoice,
        });
    } catch (error) {
        next(error);
    }
};

// Update Invoice
const updateInvoice = async (req, res, next) => {
    try {
        const {
            purchase_order_id,
            invoice_number,
            invoice_date,
            status,
        } = req.body;

        const existingInvoice = await Invoice.getInvoiceById(req.params.id);

        if (!existingInvoice) {
            return next(new AppError("Invoice not found", 404));
        }

        const invoice_file = req.file
            ? req.file.filename
            : existingInvoice.invoice_file;

        const result = await Invoice.updateInvoice(
            req.params.id,
            purchase_order_id,
            invoice_number,
            invoice_file,
            invoice_date,
            status
        );

        res.status(200).json({
            success: true,
            message: "Invoice updated successfully",
            affectedRows: result.affectedRows,
        });
    } catch (error) {
        next(error);
    }
};

// Mark Invoice as Paid
const markInvoiceAsPaid = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { payment_method, transaction_id } = req.body;

        // Check if invoice exists
        const invoice = await Invoice.getInvoiceById(id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found",
            });
        }

        await Invoice.markInvoiceAsPaid(
            id,
            "Paid",
            new Date(),
            payment_method,
            transaction_id
        );

        res.status(200).json({
            success: true,
            message: "Invoice marked as paid successfully",
        });
    } catch (error) {
        next(error);
    }
};

// Delete Invoice
const deleteInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.getInvoiceById(req.params.id);

        if (!invoice) {
            return next(new AppError("Invoice not found", 404));
        }

        const result = await Invoice.deleteInvoice(req.params.id);

        res.status(200).json({
            success: true,
            message: "Invoice deleted successfully",
            affectedRows: result.affectedRows,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createInvoice,
    getAllInvoices,
    getInvoiceById,
    updateInvoice,
    markInvoiceAsPaid,
    deleteInvoice,
};
