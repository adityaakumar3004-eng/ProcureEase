const db = require("../config/db");

// Get All Payments
const getAllPayments = async () => {
    const [rows] = await db.execute(`
        SELECT
            i.id,
            i.invoice_number,
            i.purchase_order_id,
            v.name AS vendor_name,
            i.payment_method,
            i.transaction_id,
            i.payment_date,
            i.payment_status
        FROM invoices i
        JOIN purchase_orders po
            ON i.purchase_order_id = po.id
        JOIN vendors v
            ON po.vendor_id = v.id
        WHERE i.payment_status = 'Paid'
        ORDER BY i.payment_date DESC
    `);

    return rows;
};

module.exports = {
    getAllPayments,
};