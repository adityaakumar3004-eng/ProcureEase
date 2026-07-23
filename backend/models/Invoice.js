const db = require("../config/db");

// Create Invoice
const createInvoice = async (
    purchase_order_id,
    invoice_number,
    invoice_file,
    invoice_date,
    status = "Pending"
) => {
    const [result] = await db.execute(
        `INSERT INTO invoices
        (purchase_order_id, invoice_number, invoice_file, invoice_date, status)
        VALUES (?, ?, ?, ?, ?)`,
        [
            purchase_order_id,
            invoice_number,
            invoice_file,
            invoice_date,
            status,
        ]
    );

    return result;
};

// Get All Invoices
const getAllInvoices = async () => {
    const [rows] = await db.execute(
        `SELECT
            i.*,
            p.id AS purchase_order_number
        FROM invoices i
        JOIN purchase_orders p
            ON i.purchase_order_id = p.id
        ORDER BY i.created_at DESC`
    );

    return rows;
};

// Get Invoice By ID
const getInvoiceById = async (id) => {
    const [rows] = await db.execute(
        `SELECT
            i.*,
            p.id AS purchase_order_number
        FROM invoices i
        JOIN purchase_orders p
            ON i.purchase_order_id = p.id
        WHERE i.id = ?`,
        [id]
    );

    return rows[0];
};

// Update Invoice
const updateInvoice = async (
    id,
    purchase_order_id,
    invoice_number,
    invoice_file,
    invoice_date,
    status
) => {
    const [result] = await db.execute(
        `UPDATE invoices
        SET
            purchase_order_id = ?,
            invoice_number = ?,
            invoice_file = ?,
            invoice_date = ?,
            status = ?
        WHERE id = ?`,
        [
            purchase_order_id,
            invoice_number,
            invoice_file,
            invoice_date,
            status,
            id,
        ]
    );

    return result;
};
// Mark Invoice as Paid
const markInvoiceAsPaid = async (
    id,
    payment_status,
    payment_date,
    payment_method,
    transaction_id
) => {
    const [result] = await db.execute(
        `UPDATE invoices
        SET
            payment_status = ?,
            payment_date = ?,
            payment_method = ?,
            transaction_id = ?
        WHERE id = ?`,
        [
            payment_status,
            payment_date,
            payment_method,
            transaction_id,
            id,
        ]
    );

    return result;
};

// Delete Invoice
const deleteInvoice = async (id) => {
    const [result] = await db.execute(
        "DELETE FROM invoices WHERE id = ?",
        [id]
    );

    return result;
};

module.exports = {
    createInvoice,
    getAllInvoices,
    getInvoiceById,
    updateInvoice,
    markInvoiceAsPaid,
    deleteInvoice,
};