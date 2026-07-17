const db = require("../config/db");

// Create Sale
const createSale = async (
    product_id,
    quantity,
    price,
    total_amount
) => {
    const [result] = await db.execute(
        `INSERT INTO sales
        (product_id, quantity, price, total_amount)
        VALUES (?, ?, ?, ?)`,
        [product_id, quantity, price, total_amount]
    );

    return result;
};

// Get All Sales
const getAllSales = async () => {
    const [rows] = await db.execute(`
        SELECT
            s.id,
            p.name AS product_name,
            s.quantity,
            s.price,
            s.total_amount,
            s.created_at
        FROM sales s
        JOIN products p
        ON s.product_id = p.id
        ORDER BY s.created_at DESC
    `);

    return rows;
};

module.exports = {
    createSale,
    getAllSales,
};